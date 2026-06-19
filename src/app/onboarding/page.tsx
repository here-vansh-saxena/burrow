import { auth } from '@clerk/nextjs/server'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import OnboardingForm from './OnboardingForm'

export default async function OnboardingPage() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }

  const supabase = await createClient()
  
  // Check if they already completed onboarding (e.g. have a college set)
  const { data: user } = await supabase
    .from('users')
    .select('college')
    .eq('id', userId)
    .single()

  if (user?.college) {
    redirect('/discover') // Send them to the main app
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white py-12 px-4 sm:px-6 lg:px-8 flex justify-center">
      <div className="max-w-xl w-full space-y-8 bg-gray-900 p-8 rounded-2xl border border-gray-800 shadow-2xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Complete Your Profile
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Let's get to know you better to find your perfect matches at DU.
          </p>
        </div>
        <OnboardingForm />
      </div>
    </div>
  )
}
