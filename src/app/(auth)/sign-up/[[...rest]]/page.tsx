"use client"

import { SignUp } from '@clerk/nextjs'
import React from 'react'

export default function SignInPage() {
  return (
    <div className='py-24 flex-1 flex justify-center items-center'>
      <SignUp />
    </div>
  )
}
