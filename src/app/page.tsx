'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const [mode, setMode] = useState<'create' | 'join' | null>(null)
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const router = useRouter()

  const handleCreate = async () => {
    const res = await fetch('/api/projects', {
      method: 'POST',
      body: JSON.stringify({ name }),
    })
    const data = await res.json()
    router.push(`/dashboard/${data.code}`)
  }

  const handleJoin = () => {
    router.push(`/dashboard/${code.toUpperCase()}`)
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-50 text-black">
      <h1 className="text-3xl font-bold mb-6">Bienvenue sur Scrumy 🧠</h1>

      {mode === null && (
        <div className="space-x-4">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => setMode('create')}
          >
            Créer un projet
          </button>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded"
            onClick={() => setMode('join')}
          >
            Rejoindre un projet
          </button>
        </div>
      )}

      {mode === 'create' && (
        <div className="mt-6">
          <input
            placeholder="Nom du projet"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 mr-2"
          />
          <button
            onClick={handleCreate}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Créer
          </button>
        </div>
      )}

      {mode === 'join' && (
        <div className="mt-6">
          <input
            placeholder="Code du projet (6 lettres)"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="border p-2 mr-2 uppercase"
            maxLength={6}
          />
          <button
            onClick={handleJoin}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Rejoindre
          </button>
        </div>
      )}
    </main>
  )
}