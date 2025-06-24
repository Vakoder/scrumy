// dashboard/[code]/page.tsx
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default async function DashboardPage({ params }: { params: { code: string } }) {
  const { code } = await params;
  const { data: projet } = await supabase
    .from('projet')
    .select('*')
    .eq('code', code.toUpperCase())
    .single();

  // Configuration des actions
  const actions = [
    {
      title: "Gérer les rôles",
      icon: "👥",
      href: `/dashboard/${projet.code}/participants`,
      completed: true,
      buttonClass: "bg-indigo-600 hover:bg-indigo-700"
    },
    {
      title: "Ajouter une story",
      icon: "📝",
      href: `/dashboard/${projet.code}/stories/new`,
      completed: false,
      buttonClass: "bg-emerald-600 hover:bg-emerald-700"
    },
    {
      title: "Ajouter un sprint",
      icon: "🏃",
      href: `/dashboard/${projet.code}/sprints/new`,
      completed: true,
      buttonClass: "bg-amber-600 hover:bg-amber-700"
    },
    {
      title: "Lancer un daily",
      icon: "🔄",
      href: `/dashboard/${projet.code}/daily`,
      completed: true,
      buttonClass: "bg-blue-600 hover:bg-blue-700"
    },
    {
      title: "Rejoindre le daily",
      icon: "🤝",
      href: `/dashboard/${projet.code}/daily/join`,
      completed: true,
      buttonClass: "bg-green-600 hover:bg-green-700"
    },
    {
      title: "Voir le backlog",
      icon: "📚",
      href: `/dashboard/${projet.code}/stories`,
      completed: false,
      buttonClass: "bg-purple-600 hover:bg-purple-700"
    }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header amélioré */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                <span>{projet.name}</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {projet.code}
                </span>
              </h1>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="text-gray-500">
                  Créé le {new Date(projet.created_at).toLocaleDateString('fr-FR')}
                </span>
                <span className="text-gray-400">•</span>
                <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                  Version {projet.version || 1}
                </span>
              </div>
            </div>
            
            {/* Bouton d'action principal */}
            <Link 
              href={`/dashboard/${projet.code}/settings`}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
            >
              ⚙️ Paramètres
            </Link>
          </div>
        </div>

        {/* Grille d'actions réorganisée */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {actions.map((action) => (
            <div 
              key={action.title}
              className={`bg-white rounded-xl shadow-sm overflow-hidden border ${
                action.completed ? 'border-green-200' : 'border-gray-200'
              }`}
            >
              <div className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{action.icon}</span>
                  <h3 className="text-lg font-medium text-gray-800">
                    {action.title}
                  </h3>
                </div>
                
                <Link
                  href={action.href}
                  className={`w-full px-4 py-2 text-white rounded-md transition-colors flex items-center justify-center gap-2 ${
                    action.buttonClass
                  } ${
                    action.completed ? 'opacity-90' : 'opacity-100'
                  }`}
                >
                  {action.completed ? '✓ Accéder' : 'Commencer'}
                </Link>
                
                {action.completed && (
                  <div className="mt-3 text-xs text-green-600 flex items-center gap-1">
                    ✓ Action complétée
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Section statistiques */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">📊 Aperçu du projet</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Sprints" value="3" />
            <StatCard label="Stories" value="12" />
            <StatCard label="Participants" value="5" />
            <StatCard label="Progression" value="65%" />
          </div>
        </div>

        {/* Pied de page */}
        <div className="text-center text-sm text-gray-500 mt-8">
          ID du projet : <span className="font-mono">{projet.id}</span>
        </div>
      </div>
    </main>
  );
}

// Composant StatCard réutilisable
function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <div className="text-gray-500 text-sm">{label}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
    </div>
  );
}