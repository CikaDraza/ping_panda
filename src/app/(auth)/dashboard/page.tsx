import React, { ReactNode } from 'react'
import MaxWidthWrapper from '@/app/components/max-width-wrapper'
import Heading from '@/app/components/heading'
import DashboardContentPage from './dashboard-content-page'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

interface DashboardPageProps {
  title: string,
  children?: ReactNode,
  cta?: ReactNode
}

export default async function Dashboard({
  title,
  children,
  cta
}: DashboardPageProps) {
  const user = await currentUser();

  if (!user) {
    redirect('/sign-in');
  }
  
  return (
    <section className='flex-1 h-full w-full flex flex-col'>
        <div className='p-6 sm:p-8 flex border-b border-gray-200'>
          <MaxWidthWrapper>
            <div className='flex flex-col sm:flex-row sm:items-center gap-y-2 gap-x-8'>
              <Heading>Dashboard</Heading>
            </div>
          </MaxWidthWrapper>
        </div>
        <DashboardContentPage />
    </section>
  )
}
