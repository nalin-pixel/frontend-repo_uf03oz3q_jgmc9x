import React, { useEffect, useState } from 'react'
import TeamForm from './components/TeamForm'
import NearbyFinder from './components/NearbyFinder'
import RequestsPanel from './components/RequestsPanel'

const App = () => {
  const [backendUrl] = useState(import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000')

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">FindRival</h1>
          <div className="text-sm text-gray-500">MVP v1.0</div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-10">
        <section className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Create your team</h2>
          <TeamForm backendUrl={backendUrl} />
        </section>

        <section className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Find nearby opponents</h2>
          <NearbyFinder backendUrl={backendUrl} />
        </section>

        <section className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Match requests</h2>
          <RequestsPanel backendUrl={backendUrl} />
        </section>
      </main>

      <footer className="border-t bg-white/50">
        <div className="max-w-5xl mx-auto px-4 py-6 text-xs text-gray-500">
          © {new Date().getFullYear()} FindRival — connect with local teams and play.
        </div>
      </footer>
    </div>
  )
}

export default App
