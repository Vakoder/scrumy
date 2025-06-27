'use client'
import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

export default function AddParticipantForm({ projectCode, isCp }: { projectCode: string, isCp: boolean }) {
  const [name, setName] = useState('')
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const availableRoles = [
    { value: 'DEV', label: '👨‍💻 Développeur' },
    { value: 'PO', label: '📋 Product Owner' },
    { value: 'SM', label: '🔄 Scrum Master' },
    { value: 'CP', label: '👔 Chef de Projet' }
  ]

  const handleRoleToggle = (role: string) => {
    setSelectedRoles(prev =>
      prev.includes(role)
        ? prev.filter(r => r !== role)
        : [...prev, role]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    if (!name.trim()) {
      setError('Le nom est requis')
      return
    }
    
    if (selectedRoles.length === 0) {
      setError('Sélectionnez au moins un rôle')
      return
    }

    // Seul le CP peut attribuer le rôle CP
    if (selectedRoles.includes('CP') && !isCp) {
      setError('Seul le Chef de Projet peut attribuer ce rôle')
      return
    }

    try {
      const { error: insertError } = await supabase
        .from('participants')
        .insert([{
          name: name.trim(),
          roles: selectedRoles,
          project_code: projectCode,
          approved: isCp, 
          joined_at: new Date().toISOString()
        }])

      if (insertError) throw insertError

      setName('')
      setSelectedRoles([])
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
      
    } catch (err) {
      console.error("Erreur:", err)
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Erreur lors de l'ajout")
      }
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Champ Nom */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nom complet
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Sélection multi-rôles */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rôles à attribuer {!isCp && "(Validation CP requise)"}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {availableRoles.map((role) => (
              <label 
                key={role.value} 
                className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedRoles.includes(role.value)
                    ? 'bg-blue-50 border-blue-200'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                } ${
                  role.value === 'CP' && !isCp ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedRoles.includes(role.value)}
                  onChange={() => handleRoleToggle(role.value)}
                  disabled={role.value === 'CP' && !isCp}
                  className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="ml-3 text-gray-700">{role.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Messages d'état */}
        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="p-3 bg-green-50 text-green-700 rounded-md text-sm">
            Participant ajouté {!isCp && "en attente de validation CP"}
          </div>
        )}

        {/* Boutons */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              setName('')
              setSelectedRoles([])
              setError(null)
            }}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Réinitialiser
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            {isCp ? 'Valider' : 'Demander à rejoindre'}
          </button>
        </div>
      </form>
    </div>
  )
}