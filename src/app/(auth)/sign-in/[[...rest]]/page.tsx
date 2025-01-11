"use client"

import { SignIn } from '@clerk/nextjs'
import React from 'react'

export default function SignInPage() {
  return (
    <div className='py-24 flex-1 flex justify-center items-center'>
      <SignIn />
    </div>
  )
}
