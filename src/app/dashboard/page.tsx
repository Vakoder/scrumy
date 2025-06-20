import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface Props {
  params: {
    code: string
  }
}


export default async function DashboardPage({ params }: Props) {
  const { code } = params

  const { data: project, error } = await supabase
    .from('project')
    .select('*')
    .eq('code', code)
    .single()

  if (error || !project) {
    return (
      <div className="p-8 text-red-600">
        Projet non trouvé avec le code : <strong>{code}</strong>
      </div>
    )
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">
        Projet : {project.name} ({project.code})
      </h1>

      <div className="mt-6 space-y-2">
        <h2 className="text-xl font-semibold mb-2">Actions</h2>
        <div className="grid gap-2">
          <Link href={`/dashboard/${project.code}/participants`} className="btn">👥 Gérer les rôles</Link>
          <Link href={`/dashboard/${project.code}/stories/new`} className="btn">📘 Ajouter une story</Link>
          <Link href={`/dashboard/${project.code}/sprints/new`} className="btn">📅 Ajouter un sprint</Link>
          <Link href={`/dashboard/${project.code}/daily`} className="btn">🔁 Lancer un daily</Link>
          <Link href={`/dashboard/${project.code}/daily/join`} className="btn">🚀 Rejoindre le daily</Link>
          <Link href={`/dashboard/${project.code}/stories`} className="btn">📚 Voir le backlog</Link>
        </div>
      </div>

      <div className="space-y-2">
        <p>ID : {project.id}</p>
        <p>Créé le : {new Date(project.created_at).toLocaleString()}</p>
        <p>Version : {project.version || 1}</p>
      </div>

      {/* TODO : afficher les participants, sprints, stories plus tard */}
    </main>
  )
}