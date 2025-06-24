'use client'

import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

export default function ParticipantActions({
  participant,
  isCurrentUserCp
}: {
  participant: any
  isCurrentUserCp: boolean
}) {
  const router = useRouter()

  const handleApprove = async () => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    
    const { error } = await supabase
      .from('participants')
      .update({ approved: true })
      .eq('id', participant.id)

    if (!error) router.refresh()
  }

  const handleBan = async () => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    
    const { error } = await supabase
      .from('participants')
      .update({ banned: true })
      .eq('id', participant.id)

    if (!error) router.refresh()
  }

  if (!isCurrentUserCp) return null

  return (
    <div className="flex gap-2 ml-2">
      {!participant.approved && (
        <button
          onClick={handleApprove}
          className="px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
        >
          Approuver
        </button>
      )}
      {participant.approved && !participant.banned && (
        <button
          onClick={handleBan}
          className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
        >
          Bannir
        </button>
      )}
    </div>
  )
}