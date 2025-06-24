// app/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function HomePage() {
  const [mode, setMode] = useState<'create' | 'join' | null>(null);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const router = useRouter();

  const handleCreate = async () => {
    const res = await fetch('/api/projet', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
    const data = await res.json();
    router.push(`/dashboard/${data.code}`);
  };

  const handleJoin = () => {
    router.push(`/dashboard/${code.toUpperCase()}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-6">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Bienvenue sur <span className="text-indigo-600">Scrumy</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl">
          Gestion de projet agile simplifiée. Créez ou rejoignez un projet en un clic.
        </p>
      </motion.div>

      {/* Action Cards */}
      <div className="w-full max-w-md space-y-6">
        {mode === null ? (
          <div className="grid grid-cols-1 gap-6">
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <button
                onClick={() => setMode('create')}
                className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
              >
                <span className="text-2xl">✨</span>
                <span className="text-lg font-semibold">Créer un projet</span>
              </button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <button
                onClick={() => setMode('join')}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
              >
                <span className="text-2xl">👥</span>
                <span className="text-lg font-semibold">Rejoindre un projet</span>
              </button>
            </motion.div>
          </div>
        ) : mode === 'create' ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white p-6 rounded-xl shadow-md"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Nouveau projet</h2>
            <input
              placeholder="Nom du projet"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <div className="flex gap-3">
              <button
                onClick={handleCreate}
                className="flex-1 bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Créer
              </button>
              <button
                onClick={() => setMode(null)}
                className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Annuler
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white p-6 rounded-xl shadow-md"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Rejoindre un projet</h2>
            <input
              placeholder="Code du projet (6 lettres)"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              maxLength={6}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4 uppercase focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <div className="flex gap-3">
              <button
                onClick={handleJoin}
                disabled={code.length !== 6}
                className={`flex-1 py-3 px-4 rounded-lg transition-colors ${
                  code.length === 6
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Rejoindre
              </button>
              <button
                onClick={() => setMode(null)}
                className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Annuler
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-16 text-center text-gray-500 text-sm"
      >
        <p>Gérez vos projets agile en toute simplicité</p>
      </motion.div>
    </div>
  );
}