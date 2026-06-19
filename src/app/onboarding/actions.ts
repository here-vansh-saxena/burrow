'use server'

import { auth } from '@clerk/nextjs/server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function completeOnboarding(formData: FormData) {
  const { userId } = await auth()
  
  if (!userId) {
    throw new Error('Not logged in')
  }

  const age = parseInt(formData.get('age') as string)
  const college = formData.get('college') as string
  const course = formData.get('course') as string
  const passing_year = parseInt(formData.get('passing_year') as string)
  const intent = formData.get('intent') as string
  const interests = formData.getAll('interests') as string[]

  const supabase = await createClient()

  const { error } = await supabase
    .from('users')
    .update({
      age,
      college,
      course,
      passing_year,
      intent,
      interests
    })
    .eq('id', userId)

  if (error) {
    console.error('Error updating user during onboarding:', error)
    throw new Error('Failed to save profile details')
  }

  revalidatePath('/onboarding')
  return { success: true }
}
