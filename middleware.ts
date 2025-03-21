import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Rutas públicas que no requieren autenticación
const publicRoutes = ['/', '/login', '/register']

// Rutas protegidas que requieren autenticación
const protectedRoutes = ['/dashboard', '/profile', '/admin']

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  // Crear cliente de Supabase específico para el middleware
  const supabase = createMiddlewareClient({ req, res })
  
  // Verificar si el usuario está autenticado
  const {
    data: { session },
  } = await supabase.auth.getSession()
  
  // Obtener la ruta actual
  const path = req.nextUrl.pathname
  
  // Redirigir a login si la ruta es protegida y no hay sesión
  if (protectedRoutes.some(route => path.startsWith(route)) && !session) {
    const redirectUrl = new URL('/login', req.url)
    // Opcionalmente añadir la URL original como parámetro para redirigir después del login
    redirectUrl.searchParams.set('redirectTo', path)
    return NextResponse.redirect(redirectUrl)
  }
  
  // Redirigir al dashboard si el usuario ya está autenticado y trata de acceder a login/register
  if (session && (path === '/login' || path === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }
  
  return res
}

// Configurar en qué rutas se ejecutará el middleware
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
} 