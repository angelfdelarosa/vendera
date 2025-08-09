import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { type NextRequest, NextResponse } from 'next/server'

export const createClient = (request: NextRequest) => {
  const response = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res: response })
  return { supabase, response }
}