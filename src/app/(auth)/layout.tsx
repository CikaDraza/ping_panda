import React, { ReactNode } from 'react'
import Navbar from '@/app/components/navbar'

export default async function AuthLayout({ children }: { children: ReactNode }) {

  return (
    <>
      <Navbar />
      { children }
    </>
  )
}