import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!SIGNING_SECRET) {
    return new Response('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or Vercel', {
      status: 400,
    })
  }

  const wh = new Webhook(SIGNING_SECRET)
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing Svix headers', { status: 400 })
  }

  const payload = await req.json()
  const body = JSON.stringify(payload)

  let evt: WebhookEvent
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error: Could not verify webhook:', err)
    return new Response('Error: Verification error', { status: 400 })
  }

  if (evt.type === 'user.created') {
    const { id, email_addresses, first_name, last_name } = evt.data
    const email = email_addresses?.[0]?.email_address || ''
    const fullName = [first_name, last_name].filter(Boolean).join(' ') || 'User'

    const adminEmails = process.env.ADMIN_EMAILS?.split(',') || []
    const role = adminEmails.includes(email) ? 'admin' : 'user'

    const supabase = createServiceClient()
    
    const { error } = await supabase.from('users').insert({
      id: id,
      email: email,
      full_name: fullName,
      role: role,
    })

    if (error) {
      console.error('Error inserting user to Supabase:', error)
      return new Response('Error saving user', { status: 500 })
    }
  }

  if (evt.type === 'user.deleted') {
    const { id } = evt.data
    const supabase = createServiceClient()
    if (id) {
        await supabase.from('users').delete().eq('id', id)
    }
  }

  return new Response('Webhook received', { status: 200 })
}
