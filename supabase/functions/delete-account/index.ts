// Edge Function: elimina por completo la cuenta del usuario autenticado.
//
// Usa el `service_role key` (inyectado automáticamente por Supabase como la
// variable de entorno SUPABASE_SERVICE_ROLE_KEY) para poder borrar el usuario
// de `auth.users` vía la Admin API. Esa clave nunca se expone al frontend:
// solo vive en el entorno de esta función.
//
// Al borrar el usuario de `auth.users`, las tablas con
// `ON DELETE CASCADE` (ej. `user_content`) se limpian solas. Además borramos
// explícitamente `profiles` y `user_content` antes, por si alguna de esas
// tablas no tuviera la cascada configurada.
import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Método no permitido' }, 405)
  }

  const accessToken = (req.headers.get('Authorization') ?? '').replace('Bearer ', '').trim()

  if (!accessToken) {
    return jsonResponse({ error: 'Falta el token de autenticación' }, 401)
  }

  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  )

  const {
    data: { user },
    error: userError,
  } = await supabaseAdmin.auth.getUser(accessToken)

  if (userError || !user) {
    return jsonResponse({ error: 'Token inválido o expirado' }, 401)
  }

  try {
    await supabaseAdmin.from('user_content').delete().eq('user_id', user.id)
    await supabaseAdmin.from('profiles').delete().eq('id', user.id)

    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id)
    if (deleteError) throw deleteError

    return jsonResponse({ success: true })
  } catch (error) {
    return jsonResponse({ error: error instanceof Error ? error.message : 'Error desconocido' }, 500)
  }
})
