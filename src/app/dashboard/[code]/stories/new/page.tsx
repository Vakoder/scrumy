'use client'
import { supabase } from '@/lib/supabase';
import { createClient } from '@supabase/supabase-js';
import { data } from 'framer-motion/client';
import { useRouter } from 'next/navigation';
import { use } from 'react';

export default function NewStoryPage({ params }: { params: Promise<{ code: string }> }) { 
  const router = useRouter();
  const { code } = use(params); 

  const priorities = [
    { value: 'MUST', label: '🔴 Doit avoir' },
    { value: 'SHOULD', label: '🟡 Devrait avoir' },
    { value: 'COULD', label: '🔵 Pourrait avoir' },
    { value: 'WOULD', label: '⚪ Souhaitable' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const effort = parseInt(formData.get('effort') as string);
    const priority = formData.get('priority') as string;

    if (!title || !description || !effort || !priority) {
      alert('Tous les champs sont requis');
      return;
    }

    try {
      const initialRemaining = effort * 3;
      const { error } = await supabase
        .from('stories')
        .insert([{
          title,
          description,
          effort,
          remaining: initialRemaining,
          priority,
          project_code: code, 
          status: 'backlog',
          created_at: new Date().toISOString()
        }])
        .select();

      if (error) {
    console.error("Détails de l'erreur Supabase:", error);
    throw error;
  }

  console.log("Story créée avec succès:", data); // Debug
  router.push(`/dashboard/${code}/stories`);
} catch (error) {
  console.error("Erreur complète:", error); // Affichez l'erreur complète
  alert("Erreur lors de la création. Voir la console pour les détails.");
}
  };


  return (
    <div className='bg-white min-h-screen text-gray-800'>
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">📝 Nouvelle Story</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label>Titre</label>
            <input 
              type="text" 
              name="title" 
              required 
              className="w-full p-2 border rounded" 
            />
          </div>
          <div>
            <label>Effort (Fibonacci)</label>
            <select 
              name="effort" 
              required 
              className="w-full p-2 border rounded"
              defaultValue="1"
            >
              {[1, 2, 3, 5, 8].map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div>
          <label>Description</label>
          <textarea 
            name="description" 
            rows={4} 
            required 
            className="w-full p-2 border rounded" 
          />
        </div>
        
        <div>
          <label>Priorité</label>
          <div className="grid grid-cols-4 gap-2">
            {priorities.map(p => (
              <label key={p.value} className="flex items-center gap-2 p-2 border rounded">
                <input 
                  type="radio" 
                  name="priority" 
                  value={p.value} 
                  required 
                  defaultChecked={p.value === 'MUST'} // Valeur par défaut
                />
                {p.label}
              </label>
            ))}
          </div>
        </div>
        
        <div className="flex justify-end gap-3">
          <button 
            type="button" 
            onClick={() => router.back()} 
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Annuler
          </button>
          <button 
            type="submit" 
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Créer
          </button>
        </div>
      </form>
    </div>
    </div>
  );
}