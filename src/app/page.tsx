import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-8 text-center">
      <h1 className="text-5xl font-bold mb-4 text-indigo-400">Burrow</h1>
      <p className="text-xl text-gray-300 mb-8 max-w-md">
        Find your people at DU. Connect, chat, and keep your FinLit streak alive.
      </p>
      <div className="flex gap-4">
        <Link 
          href="/sign-up"
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-medium transition-colors"
        >
          Get Started
        </Link>
        <Link 
          href="/sign-in"
          className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-full font-medium transition-colors"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
}
