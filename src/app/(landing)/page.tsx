import React from 'react'
import MaxWidthWrapper from '@/app/components/max-width-wrapper'
import Heading from '@/app/components/heading'
import { Check } from 'lucide-react'
import ShinyButton from '@/app/components/shiny-button'

export default function Home() {
  return (
    <>
      <section className='py-24 sm:py-32 bg-brand-25'>
        <MaxWidthWrapper className={''}>
          <div className='mx-auto text-center flex flex-col items-center gap-10'>
            <Heading clasName='text-center'>
              <span>
                Real-Time SaaS Insights,
              </span>
              <br />
              <span className='bg-gradient-to-r from-brand-700 to-brand-800 text-transparent bg-clip-text'>Deliverd to Your Discord</span>
            </Heading>
            <p className='text-base/7 text-gray-600 max-w-prose text-center text-pretty'>
              PingWolf is the easiest way to monitor your Saas. Get instant notifications for{" "}
              <span className='font-semibold text-gray-700'>
                sales, new users, or any other event
              </span>
              {" "}
              sent directly to your Discord.
            </p>
            <ul className='space-y-2 text-base/7 text-gray-600 text-left flex-col items-start'>
              {
                [
                  "Real-time Discord alerts for critical events", "Buy once, use forever", "Track sales, new users, or any other event"
                ].map((item, index) => (
                  <li key={index} className='flex gap-1.5 items-center text-left'>
                    <Check className='size-5 shrink-0 text-brand-700' />
                    { item }
                  </li>
                ))
              }
            </ul>
            <div className='max-w-80'>
              <ShinyButton href='/sign-up' className='h-14 w-full text-base'>
                Start for free today
              </ShinyButton>
            </div>
          </div>
        </MaxWidthWrapper>
          
      </section>
      <section></section>
      <section></section>
      <section></section>
    </>
  )
}