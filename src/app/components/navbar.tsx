import React from 'react'
import MaxWidthWrapper from './max-width-wrapper'
import Link from 'next/link'
import Logo from './logo'
import { SignOutButton } from '@clerk/nextjs';
import ShinyButton from './shiny-button';
import { FileKey, LogOut, Settings, SquareChevronRight } from 'lucide-react';
import { currentUser } from '@clerk/nextjs/server';
import Image from 'next/image';
import MobileMenu from './mobile-menu';

export default async function Navbar() {
  const user = await currentUser();
  const avatarUrl = user?.hasImage ? user.imageUrl : '/images/icon-user.gif';

  return (
    <header className='relative'>
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
                  <div className='hidden lg:flex justify-between items-center'>
                    <nav className='flex-1 px-16 flex justify-between items-center'>
                      <button className='px-5 py-2.5 text-white rounded-md bg-gray-700 hover:bg-gray-800'>
                        Ask AI
                      </button>
                      <Link href={'/dashboard'} className='group text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 flex items-center'>
                        Dashboard
                        <SquareChevronRight className='size-5 shrink-0 transition-transform duration-300 ease-in-out group-hover:translate-x-[2px] ml-1' />
                      </Link>
                      <Link href={'/api-keys'} className='group text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 flex items-center'>
                        API Keys
                        <FileKey className='size-5 shrink-0 transition-transform duration-300 ease-in-out group-hover:translate-x-[2px] ml-1' />
                      </Link>
                      <Link href={'/account-settings'} className='group text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 flex items-center'>
                        Account Settings
                        <Settings className='size-5 shrink-0 transition-transform duration-300 ease-in-out group-hover:translate-x-[2px] ml-1' />
                      </Link>
                    </nav>
                    <div title={user?.firstName + " " + user?.lastName} className='mr-4 rounded-full w-10 h-10 overflow-hidden flex justify-center items-center'>
                      <Image
                        src={avatarUrl}
                        alt='user avatar'
                        width={46}
                        height={46}
                      />
                    </div>
                    <SignOutButton>
                      <button type="button" className="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-md border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Sign out</button>
                    </SignOutButton>
                  </div>
                </>
                :
                <>
                  <div className='hidden lg:flex justify-end gap-2'>
                    <Link href={"/pricing"}>
                      <button type="button" className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-md border border-gray-200 hover:bg-gray-100 hover:text-brand-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Pricing</button>
                    </Link>
                    <Link href={"/sign-in"}>
                      <button type="button" className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-md border border-gray-200 hover:bg-gray-100 hover:text-brand-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Sign in</button>
                    </Link>
                    <ShinyButton href='/sign-up' className='px-5 py-2.5 me-2 mb-2 text-sm'>
                      Sign up
                    </ShinyButton>
                  </div>
                </>
              }
            </div>
            <MobileMenu>
              <div className='flex-1'>
              {
                user ?
                <>
                  <div className='lg:hidden flex flex-wrap justify-between items-center'>
                    <button className='px-5 py-2 text-white rounded-md bg-gray-700 hover:bg-gray-800'>
                        Ask AI
                    </button>
                    <div className='flex items-center mb-2'>
                      <div title={user?.firstName + " " + user?.lastName} className='mr-4 rounded-full w-10 h-10 overflow-hidden flex justify-center items-center'>
                        <Image
                          src={avatarUrl}
                          alt='user avatar'
                          width={46}
                          height={46}
                        />
                      </div>
                      <SignOutButton>
                        <LogOut />
                      </SignOutButton>
                    </div>
                    <nav className='w-full flex flex-wrap justify-between items-center mt-4'>
                      <Link href={'/dashboard'} className='group w-full mb-4 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 flex items-center'>
                        Dashboard
                        <SquareChevronRight className='size-5 shrink-0 transition-transform duration-300 ease-in-out group-hover:translate-x-[2px] ml-1' />
                      </Link>
                      <Link href={'/api-keys'} className='group w-full mb-4 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 flex items-center'>
                        API Keys
                        <FileKey className='size-5 shrink-0 transition-transform duration-300 ease-in-out group-hover:translate-x-[2px] ml-1' />
                      </Link>
                      <Link href={'/account-settings'} className='group w-full text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 flex items-center'>
                        Account Settings
                        <Settings className='size-5 shrink-0 transition-transform duration-300 ease-in-out group-hover:translate-x-[2px] ml-1' />
                      </Link>
                    </nav>
                  </div>
                </>
                :
                <>
                  <div className='lg:hidden flex flex-wrap justify-end gap-2'>
                    <Link href={"/pricing"}>
                      <button type="button" className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-md border border-gray-200 hover:bg-gray-100 hover:text-brand-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Pricing</button>
                    </Link>
                    <Link href={"/sign-in"}>
                      <button type="button" className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-md border border-gray-200 hover:bg-gray-100 hover:text-brand-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Sign in</button>
                    </Link>
                    <ShinyButton href='/sign-up' className='px-5 py-2.5 me-2 mb-2 text-sm'>
                      Sign up
                    </ShinyButton>
                  </div>
                </>
              }
              </div>
            </MobileMenu>

          </div>
        </MaxWidthWrapper>
      </nav>
    </header>
  )
}
