"use client"

import React from 'react'
import MaxWidthWrapper from '@/app/components/max-width-wrapper'
import { IEventCategory } from '@/server/models/EventCategory';
import EmptyCategoryState from './empty-category-state';
import { useRouter } from 'next/navigation';

interface CategoryContentPageProps {
  hasEvents: boolean,
  category: IEventCategory,
  userEmail: string
}

export default function CategoryContentPage({
  hasEvents,
  category,
  userEmail
}: CategoryContentPageProps ) {
  const router = useRouter();

  return (
    <MaxWidthWrapper>
      <div className="py-8">
        {
          hasEvents ? (
            <p>{`Kategorija "${category.name}" trenutno ima povezane događaje.`}</p>
          ) : (
            <EmptyCategoryState categoryName={category.name} userEmail={userEmail} />
          )
        }
      </div>
    </MaxWidthWrapper>
  )
}
