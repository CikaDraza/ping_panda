import React from 'react'
import MaxWidthWrapper from './max-width-wrapper'
import Link from 'next/link'
import Logo from './logo'
import { SignInButton, SignOutButton, SignUpButton } from '@clerk/nextjs';
import ShinyButton from './shiny-button';
import { SquareChevronRight } from 'lucide-react';

export default function Navbar() {
  const user = false;

  return (
    <header>
      <nav>
        <MaxWidthWrapper className='py-4'>
          <div className='flex h-16 items-center justify-between'>
            <Link href="/" className='flex items-center'>
              <Logo />
              <div className='pl-2'>
                <span className='font-semibold text-xl'>Ping</span>
                <span className='font-semibold text-xl text-brand-700'>Wolf</span>
              </div>
            </Link>
            <div className='flex-1'>
              {
                user ?
                <>
                  <div className='flex justify-between items-center'>
                    <nav className='flex-1 px-16 flex justify-between items-center'>
                      <button className='px-5 py-2.5 text-white rounded-md bg-gray-700 hover:bg-gray-800'>
                        Ask AI
                      </button>
                      <Link href={'/dashboard'} className='group text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 flex items-center'>
                        Dashboard
                        <SquareChevronRight className='size-5 shrink-0 transition-transform duration-300 ease-in-out group-hover:translate-x-[2px] ml-1' />
                      </Link>
                    </nav>
                    <SignOutButton>
                      <button type="button" className="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-md border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Sign out</button>
                    </SignOutButton>
                  </div>
                </>
                :
                <>
                  <div className='flex justify-end gap-2'>
                    <Link href={"/pricing"}>
                      <button type="button" className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-md border border-gray-200 hover:bg-gray-100 hover:text-brand-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Pricing</button>
                    </Link>
                    <SignInButton>
                      <button type="button" className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-md border border-gray-200 hover:bg-gray-100 hover:text-brand-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Sign in</button>
                    </SignInButton>
                    <SignUpButton>
                      <ShinyButton href='#' className='px-5 py-2.5 me-2 mb-2 text-sm'>
                        Sign up
                      </ShinyButton>
                    </SignUpButton>
                  </div>
                </>
              }
            </div>
          </div>
        </MaxWidthWrapper>
      </nav>
    </header>
  )
}
