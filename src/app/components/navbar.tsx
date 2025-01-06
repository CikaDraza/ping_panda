import React from 'react'
import MaxWidthWrapper from './max-width-wrapper'
import Link from 'next/link'
import Logo from './logo'

export default function Navbar() {
  return (
    <MaxWidthWrapper className='py-4'>
      <nav>
        <div className='flex h-16 items-center justify-between'>
          <Link href="/" className='flex items-center'>
            <Logo />
            <div className='pl-2'>
              <span className='font-semibold text-xl'>Ping</span>
              <span className='font-semibold text-xl text-brand-700'>Wolf</span>
            </div>
          </Link>
        </div>
      </nav>
    </MaxWidthWrapper>
  )
}
