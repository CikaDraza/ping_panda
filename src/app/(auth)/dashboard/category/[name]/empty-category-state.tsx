"use client"

import Link from 'next/link'
import React from 'react'
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface EmptyCategoryStateProps {
  categoryName: string,
  userEmail: string
}

export default function EmptyCategoryState({ categoryName, userEmail }: EmptyCategoryStateProps) {

  const codeSnippet = `await fetch("http://localhost:3000/api/v1/events", {
    method: "POST",
    body: JSON.stringify({
      category: '${categoryName}',
      fields: {
        plan: "value1", // for example: PRO
        email: "${userEmail}",
        amount: "value3" // for example: $16
      }
    }),
    headers: {
      Authorization: "Bearer <YOUR_API_KEY>"
    }
  })` 

  return (

    <div className="max-w-2xl w-full mx-auto justify-center p-4 text-center bg-white border border-gray-200 rounded-lg shadow-sm sm:p-8 dark:bg-gray-800 dark:border-gray-700">
        <h2 className="mb-2 text-3xl font-bold text-zinc-700 dark:text-white">Create your first {categoryName} event</h2>
        <p className="mb-5 text-base text-zinc-500 sm:text-lg dark:text-gray-400">Get started by sending a request to our tracking API.</p>

        <div className='w-full max-w-3xl bg-white rounded-t-lg shadow-lg overflow-hidden'>
          <div className='bg-gray-800 px-4 py-2 flex justify-between items-center'>
            <div className='flex space-x-2'>
              <div className='size-3 rounded-full bg-red-500' />
              <div className='size-3 rounded-full bg-yellow-500' />
              <div className='size-3 rounded-full bg-green-500' />
            </div>
            <span className='text-gray-400 text-sm'>your-first-event.js</span>
          </div>
        </div>
        <SyntaxHighlighter language='javascript' style={oneDark} customStyle={{
          borderRadius: "0px",
          margin: 0,
          padding: "1rem",
          fontSize: ".875rem",
          lineHeight: "1.5"
        }}>
          { codeSnippet }
        </SyntaxHighlighter>

        <div className='mt-8 flex items-center justify-center space-x-2'>
          <span className="relative flex size-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex size-3 rounded-full bg-green-500" />
          </span>
          <span className='text-sm text-gray-600'>Listening to incoming events...</span>
          <div>
          </div>
        </div>

        <div className="mt-8 items-center justify-center space-y-4 sm:flex sm:space-y-0 sm:space-x-4 rtl:space-x-reverse">
          <p className='text-sm/6 text-gray-600'>
          🛟{" "}Need help? Check out our {" "}
            <Link href="#" className="inline-flex font-medium items-center text-blue-600 hover:underline">
              See our documentation
            </Link>
            {" "} or {" "}
            <Link href="#" className="inline-flex font-medium items-center text-blue-600 hover:underline">contact support</Link>
          </p>
          .
        </div>
    </div>

  )
}
