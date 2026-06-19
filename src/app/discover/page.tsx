import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function DiscoverPage() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
      <h1 className="text-3xl font-bold mb-4">Discover</h1>
      <p className="text-gray-400">Swipe interface coming soon in Phase 2!</p>
    </div>
  )
}
