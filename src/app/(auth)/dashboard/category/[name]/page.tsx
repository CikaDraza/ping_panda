import Heading from '@/app/components/heading';
import MaxWidthWrapper from '@/app/components/max-width-wrapper';
import db from '@/db';
import EventCategory from '@/server/models/EventCategory';
import User from '@/server/models/User';
import { currentUser } from '@clerk/nextjs/server';
import { notFound } from 'next/navigation'
import React from 'react'
import CategoryContentPage from './category-content-page';
import Event from '@/server/models/Event';

interface CategoryPageProps {
  params: {
    name: string | string[] | undefined
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const auth = await currentUser();

  if (typeof params.name !== "string") {
    return notFound();
  }

  if (!auth) {
    return notFound();
  }

  try {
    db.connect();
  
    const user = await User.findOne({externalId: auth.id });
  
    if (!user) {
      return notFound();
    }
  
    const categoryName = decodeURIComponent(params.name);
    const category = await EventCategory.findOne({
      name: categoryName,
      userId: user.externalId
    })
    
    if (!category) {
      return notFound();
    }
  
    const parseCategory = JSON.parse(JSON.stringify(category));
    const hasEvents = !!(await Event.exists({ eventCategoryId: category._id }));

    return (
      <section className='flex-1 h-full w-full flex flex-col'>
          <div className='p-6 sm:p-8 flex border-b border-gray-200'>
            <MaxWidthWrapper>
              <div className='flex flex-col sm:flex-row sm:items-center gap-y-2 gap-x-8'>
                <Heading>{`${parseCategory.emoji} ${parseCategory.name}`}</Heading>
              </div>
            </MaxWidthWrapper>
          </div>
          <CategoryContentPage hasEvents={!!hasEvents} category={parseCategory} userEmail={user.email} />
      </section>
    )

  } finally {
    db.disconnect();
  }
}
