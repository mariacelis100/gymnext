'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/core/auth/auth-context'
import { useRouter } from 'next/navigation'

// Definir datos para las historias destacadas
const stories = [
  { id: 1, title: 'Horario', image: '/images/stories/horario.jpg' },
  { id: 2, title: 'Promociones', image: '/images/stories/promociones.jpg' },
  { id: 3, title: 'Entrenadores', image: '/images/stories/entrenadores.jpg' },
  { id: 4, title: 'Nutrición', image: '/images/stories/nutricion.jpg' },
  { id: 5, title: 'Clases', image: '/images/stories/clases.jpg' },
  { id: 6, title: 'Testimonios', image: '/images/stories/testimonios.jpg' }
]

// Definir datos para las publicaciones
const posts = [
  {
    id: 1, 
    title: 'HORARIO RICO',
    description: '¡Aprovecha nuestros nuevos horarios! Lunes a viernes 6:30AM a 8:00PM, Sábados y domingos 7:00AM a 12:00PM',
    image: '/images/posts/horario.jpg',
    likes: 124,
    date: '2 días atrás'
  },
  {
    id: 2, 
    title: 'SIN DISCIPLINA NO HAY RESULTADOS',
    description: '¿Qué esperas para empezar a transformar tu cuerpo? ¡Inscríbete ya!',
    image: '/images/posts/disciplina.jpg',
    likes: 89,
    date: '3 días atrás'
  },
  {
    id: 3, 
    title: 'MARZO LLEGÓ',
    description: 'Para alcanzar tus metas... ¡POR SOLO $45! Aprovecha esta promoción exclusiva.',
    image: '/images/posts/marzo.jpg',
    likes: 156,
    date: '5 días atrás'
  }
]

export default function WelcomePage() {
  const { user, loading } = useAuth()
  const [activePost, setActivePost] = useState<number | null>(null)
  const router = useRouter()
  
  // Redirigir si no hay usuario autenticado
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  // Si todavía está cargando o no hay usuario, mostrar indicador de carga
  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#00B7FF] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-700">Cargando...</p>
        </div>
      </div>
    )
  }
  
  // Placeholder para imágenes faltantes
  const placeholderImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiMwMEI3RkYiLz48cGF0aCBkPSJNODAgODBIMTIwVjEyMEg4MFY4MFoiIGZpbGw9IiMwQTFBM0YiLz48L3N2Zz4='
  
  // Obtener imagen de perfil del usuario o usar placeholder
  const getUserProfileImage = (user: any) => {
    return placeholderImage;
  }
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header estilo Instagram */}
      <header className="bg-white border-b border-gray-300 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto p-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-semibold font-['Dancing_Script']">GymNext</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link href="/dashboard" className="text-black">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </Link>
            
            <Link href="/profile" className="h-8 w-8 rounded-full overflow-hidden border border-gray-300">
              <Image 
                src={getUserProfileImage(user)} 
                alt="Profile" 
                width={32} 
                height={32} 
                className="h-full w-full object-cover" 
              />
            </Link>
          </div>
        </div>
      </header>
      
      <main className="max-w-4xl mx-auto bg-white min-h-screen">
        {/* Mensaje de bienvenida personalizado */}
        <div className="p-6 bg-[#0A1A3F] text-white">
          <h2 className="text-2xl font-bold mb-2">¡Bienvenido a GymNext, {user?.user_metadata?.name || 'atleta'}!</h2>
          <p className="text-lg">Aquí encontrarás todo lo que necesitas para tu rutina de entrenamiento</p>
        </div>
        
        {/* Profile section */}
        <div className="p-4 border-b border-gray-300">
          <div className="flex items-start">
            <div className="mr-6 flex-shrink-0">
              <div className="w-20 h-20 md:w-28 md:h-28 rounded-full border-2 border-[#00B7FF] p-1">
                <Image 
                  src="/images/logo.png" 
                  alt="GymNext Logo" 
                  width={100} 
                  height={100} 
                  className="rounded-full h-full w-full object-cover"
                />
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex flex-wrap items-center mb-2">
                <h2 className="text-xl font-semibold mr-4">cosmosgym</h2>
                <div className="flex space-x-2">
                  <button className="bg-[#0A1A3F] text-white px-4 py-1 rounded text-sm font-semibold">
                    Seguir
                  </button>
                  <button className="bg-gray-200 px-4 py-1 rounded text-sm font-semibold">
                    Mensaje
                  </button>
                </div>
              </div>
              
              <div className="flex mb-4 space-x-6 text-sm">
                <div>
                  <span className="font-semibold">156</span> publicaciones
                </div>
                <div>
                  <span className="font-semibold">3.2K</span> seguidores
                </div>
                <div>
                  <span className="font-semibold">42</span> seguidos
                </div>
              </div>
              
              <div className="text-sm">
                <p className="font-semibold">COSMOS GYM / Fitness • Musculación • Cardio</p>
                <p>✅ Tu mejor opción para entrenar</p>
                <p>📆 Abierto todos los días</p>
                <p>🏆 C.C Cosmos piso 4 • Barquisimeto</p>
                <p>📱 Whatsapp: +58422-5221761</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Stories destacadas */}
        <div className="p-4 overflow-x-auto">
          <div className="flex space-x-5">
            {stories.map(story => (
              <div key={story.id} className="flex flex-col items-center">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-pink-500 p-1 bg-gradient-to-tr from-yellow-400 to-pink-600">
                  <div className="w-full h-full bg-white rounded-full p-1">
                    <Image 
                      src={story.image} 
                      alt={story.title} 
                      width={80} 
                      height={80} 
                      className="rounded-full h-full w-full object-cover"
                      onError={(e) => {
                        // Fallback para imágenes que no existen
                        e.currentTarget.src = placeholderImage
                      }}
                    />
                  </div>
                </div>
                <span className="text-xs mt-1">{story.title}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Navigation tabs */}
        <div className="border-t border-gray-300 flex justify-around">
          <button className="p-3 border-t-2 border-black">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button className="p-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
            </svg>
          </button>
        </div>
        
        {/* Posts grid */}
        <div className="grid grid-cols-3 gap-1">
          {posts.map(post => (
            <div 
              key={post.id} 
              className="aspect-square relative cursor-pointer"
              onClick={() => setActivePost(post.id)}
            >
              <Image 
                src={post.image} 
                alt={post.title} 
                fill 
                className="object-cover"
                onError={(e) => {
                  // Fallback para imágenes que no existen
                  e.currentTarget.src = placeholderImage
                }}
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-opacity flex items-center justify-center">
                <div className="text-white font-bold text-lg opacity-0 hover:opacity-100">
                  {post.title}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      
      {/* Post modal */}
      {activePost && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4"
          onClick={() => setActivePost(null)}
        >
          <div 
            className="bg-white max-w-4xl w-full max-h-[90vh] rounded-lg overflow-hidden flex flex-col md:flex-row"
            onClick={e => e.stopPropagation()}
          >
            <div className="md:w-1/2 h-96 md:h-auto relative bg-black">
              <Image 
                src={posts.find(p => p.id === activePost)?.image || placeholderImage}
                alt="Post" 
                fill 
                className="object-contain"
              />
            </div>
            
            <div className="md:w-1/2 flex flex-col">
              {/* Post header */}
              <div className="flex items-center p-3 border-b">
                <div className="w-8 h-8 rounded-full overflow-hidden mr-3">
                  <Image 
                    src="/images/logo.png" 
                    alt="Profile" 
                    width={32} 
                    height={32} 
                    className="h-full w-full object-cover" 
                  />
                </div>
                <span className="font-semibold text-sm">cosmosgym</span>
                <button className="ml-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                  </svg>
                </button>
              </div>
              
              {/* Post content */}
              <div className="flex-1 overflow-y-auto p-3">
                <div className="flex items-start mb-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden mr-3 flex-shrink-0">
                    <Image 
                      src="/images/logo.png" 
                      alt="Profile" 
                      width={32} 
                      height={32} 
                      className="h-full w-full object-cover" 
                    />
                  </div>
                  <div>
                    <p>
                      <span className="font-semibold text-sm mr-2">cosmosgym</span>
                      <span className="text-sm">{posts.find(p => p.id === activePost)?.description}</span>
                    </p>
                    <p className="text-gray-400 text-xs mt-1">{posts.find(p => p.id === activePost)?.date}</p>
                  </div>
                </div>
              </div>
              
              {/* Post actions */}
              <div className="border-t p-3">
                <div className="flex items-center mb-2">
                  <button className="mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                  <button className="mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </button>
                  <button>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </button>
                  <button className="ml-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </button>
                </div>
                
                <p className="font-semibold text-sm mb-1">{posts.find(p => p.id === activePost)?.likes} Me gusta</p>
                <p className="text-gray-400 text-xs uppercase">{posts.find(p => p.id === activePost)?.date}</p>
                
                <div className="flex items-center mt-3 border-t pt-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <input 
                    type="text" 
                    placeholder="Añade un comentario..."
                    className="flex-1 border-none outline-none text-sm"
                  />
                  <button className="text-[#00B7FF] font-semibold text-sm">Publicar</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Bottom navigation (mobile) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 flex justify-between p-2">
        <Link href="/dashboard" className="p-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </Link>
        <Link href="/search" className="p-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </Link>
        <Link href="/new-post" className="p-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </Link>
        <Link href="/notifications" className="p-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </Link>
        <Link href="/profile" className="p-2">
          <div className="h-6 w-6 rounded-full overflow-hidden">
            <Image 
              src={getUserProfileImage(user)} 
              alt="Profile" 
              width={24} 
              height={24} 
              className="h-full w-full object-cover" 
            />
          </div>
        </Link>
      </div>
    </div>
  )
} 