import { cn } from '@/utils'
import React, { HTMLAttributes, ReactNode } from 'react'

interface HeadingProps extends HTMLAttributes<HTMLHeadElement> {
  children?: ReactNode
  clasName: string
}

export default function Heading({ children, className, ...props }:HeadingProps) {
  return (
    <h1 className={cn("text-4xl sm:text-5xl text-pretty font-heading font-semibold tracking-tight text-zink-500")}>
      { children }
    </h1>
  )
}
