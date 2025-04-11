'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/core/hooks/use-mock-auth'
import { useRouter } from 'next/navigation'
import { Box, Container } from '@mui/material'
import ClientWelcome from '@/features/client/components/client-welcome.component'

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
    <Container maxWidth="sm" sx={{ py: 2 }}>
      <ClientWelcome />
    </Container>
  )
} 