import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json()
  const { name } = body

  if (!name || name.trim() === '') {
    return NextResponse.json({ error: 'Nom requis' }, { status: 400 })
  }

  const code = generateCode(6)

  const { data, error } = await supabase
    .from('project')
    .insert([{ name, code }])
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

function generateCode(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  return Array.from({ length }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join('')
}