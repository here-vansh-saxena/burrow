'use client'

import { useState } from 'react'
import { completeOnboarding } from './actions'
import { useRouter } from 'next/navigation'

export default function OnboardingForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const formData = new FormData(e.currentTarget)
      await completeOnboarding(formData)
      router.push('/discover')
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      {error && <div className="text-red-500 text-sm text-center">{error}</div>}
      
      <div className="space-y-4">
        <div>
          <label htmlFor="age" className="block text-sm font-medium text-gray-300">Age</label>
          <input id="age" name="age" type="number" required min="16" max="30"
            className="mt-1 block w-full bg-gray-800 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="college" className="block text-sm font-medium text-gray-300">College at DU</label>
          <select id="college" name="college" required
            className="mt-1 block w-full bg-gray-800 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            <option value="">Select your college...</option>
            <option value="SRCC">Shri Ram College of Commerce (SRCC)</option>
            <option value="Hindu">Hindu College</option>
            <option value="Stephen">St. Stephen's College</option>
            <option value="LSR">Lady Shri Ram College (LSR)</option>
            <option value="Hansraj">Hansraj College</option>
            <option value="Miranda">Miranda House</option>
            <option value="KMC">Kirori Mal College (KMC)</option>
            <option value="Ramjas">Ramjas College</option>
            <option value="Venky">Sri Venkateswara College (Venky)</option>
            <option value="Gargi">Gargi College</option>
            <option value="Other">Other DU College</option>
          </select>
        </div>

        <div>
          <label htmlFor="course" className="block text-sm font-medium text-gray-300">Course / Major</label>
          <input id="course" name="course" type="text" required placeholder="e.g. B.Com (Hons), B.A. Economics"
            className="mt-1 block w-full bg-gray-800 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="passing_year" className="block text-sm font-medium text-gray-300">Passing Year</label>
          <input id="passing_year" name="passing_year" type="number" required min="2024" max="2030"
            className="mt-1 block w-full bg-gray-800 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="intent" className="block text-sm font-medium text-gray-300">What are you here for?</label>
          <select id="intent" name="intent" required
            className="mt-1 block w-full bg-gray-800 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            <option value="">Select intent...</option>
            <option value="study_buddy">Study Buddy</option>
            <option value="friends">Making Friends</option>
            <option value="networking">Networking / Career</option>
            <option value="dating">Dating</option>
          </select>
        </div>

        <div>
          <fieldset>
            <legend className="block text-sm font-medium text-gray-300 mb-2">Interests (Select up to 3)</legend>
            <div className="grid grid-cols-2 gap-2">
              {['Coding', 'Finance', 'Music', 'Sports', 'Photography', 'Art', 'Debating', 'Gaming'].map(interest => (
                <div key={interest} className="flex items-center">
                  <input
                    id={`interest-${interest}`}
                    name="interests"
                    type="checkbox"
                    value={interest}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-700 bg-gray-800 rounded"
                  />
                  <label htmlFor={`interest-${interest}`} className="ml-2 text-sm text-gray-300">
                    {interest}
                  </label>
                </div>
              ))}
            </div>
          </fieldset>
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Saving...' : 'Complete Profile'}
        </button>
      </div>
    </form>
  )
}
