import { supabase } from '@/lib/supabase'
import AddParticipantForm from './AddParticipantForm'
import ParticipantActions from './ParticipantActions'

export default async function ParticipantsPage({ 
  params 
}: { 
  params: { code: string } 
}) {
  // Récupération des données
  const { data: projectData } = await supabase
    .from('projet')
    .select('created_by')
    .eq('code', params.code)
    .single()

  const { data: participants } = await supabase
    .from('participants')
    .select('*')
    .eq('project_code', params.code)
    .order('joined_at', { ascending: true })

  // Vérifie si l'utilisateur actuel est le CP
  const { data: { user } } = await supabase.auth.getUser()
  const isCurrentUserCp = user?.email === projectData?.created_by

  return (
    <div className="bg-white min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">👥 Gestion des Rôles</h1>
        
        <AddParticipantForm projectCode={params.code} isCp={isCurrentUserCp} />
        
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Membres actuels</h2>
          
          {participants && participants.length > 0 ? (
            <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rôles</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {participants.map((participant) => (
                    <tr key={participant.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {participant.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {participant.roles.map((role: string) => (
                            <span
                              key={role}
                              className={`px-2 py-1 rounded-full text-xs ${
                                role === 'DEV' ? 'bg-blue-100 text-blue-800' :
                                role === 'SM' ? 'bg-yellow-100 text-yellow-800' :
                                role === 'PO' ? 'bg-green-100 text-green-800' :
                                'bg-purple-100 text-purple-800'
                              }`}
                            >
                              {role === 'DEV' && 'Développeur'}
                              {role === 'SM' && 'Scrum Master'}
                              {role === 'PO' && 'Product Owner'}
                              {role === 'CP' && 'Chef de Projet'}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {!participant.approved ? (
                          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                            En attente
                          </span>
                        ) : participant.banned ? (
                          <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
                            Banni
                          </span>
                        ) : (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                            Actif
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(participant.joined_at).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <ParticipantActions 
                          participant={participant} 
                          isCurrentUserCp={isCurrentUserCp} 
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">Aucun membre pour ce projet.</p>
          )}
        </div>
      </div>
    </div>
  )
}