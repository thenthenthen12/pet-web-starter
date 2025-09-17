// src/lib/supabaseAdmin.ts
import { createClient } from '@supabase/supabase-js'

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,   // 동일한 URL
  process.env.SUPABASE_SERVICE_ROLE!       // 서버 전용 키(절대 클라이언트에 노출 금지)
)
