"use client"

import React, { useEffect, useState } from 'react'
import MaxWidthWrapper from '@/app/components/max-width-wrapper'
import { IEventCategory } from '@/server/models/EventCategory';
import EmptyCategoryState from './empty-category-state';
import { useSearchParams } from 'next/navigation';
import { IEvent } from '@/server/models/Event';

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
  const [activeTab, setActiveTab] = useState<"today" | "week" | "month">("today")
  const [events, setEvents] = useState<IEvent[]>([]);
  const [counts, setCounts] = useState<{ today: number; week: number; month: number }>({
    today: 0,
    week: 0,
    month: 0,

  });
  const [loading, setLoading] = useState(false);

  const searchParams = useSearchParams()
  const page = parseInt(searchParams.get("page") || "1", 10)
  const limit = parseInt(searchParams.get("limit") || "30", 10)

  const [pagination, setPagination] = useState({
    pageIndex: page - 1,
    pageSize: limit
  })

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/event-details?categoryId=${category._id}&period=${activeTab}`);
        if (!res.ok) throw new Error("Failed to fetch events");
        const data = await res.json();
        setEvents(data.events);
        setCounts(data.counts);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    if (hasEvents) {
      fetchEvents();
    }
  }, [activeTab, category._id, hasEvents]);

  return (
    <MaxWidthWrapper>
      <div className="py-8">
        {
          hasEvents ? (
            <div>
              <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
                  <ul className="flex flex-wrap -mb-px text-sm font-medium text-center" id="default-styled-tab" data-tabs-toggle="#default-styled-tab-content" data-tabs-active-classes="text-brand-600 hover:text-brand-600 dark:text-brand-500 dark:hover:text-brand-500 border-brand-600 dark:border-brand-500" data-tabs-inactive-classes="dark:border-transparent text-gray-500 hover:text-gray-600 dark:text-gray-400 border-gray-100 hover:border-gray-300 dark:border-gray-700 dark:hover:text-gray-300" role="tablist">
                    {["today", "week", "month"].map((tab) => (
                        <li key={tab} className="me-2" role="presentation">
                            <button onClick={() => setActiveTab(tab as "today" | "week" | "month")} className={`inline-block p-4 border-b-2 rounded-t-lg ${ activeTab === tab ? "border-brand-600 text-brand-600" : "hover:text-gray-600 hover:border-gray-300" }`} id={`${tab}-styled-tab`} data-tabs-target={`#styled-${tab}`} type="button" role="tab" aria-controls={`${tab}`} aria-selected="false">{tab === "today" ? "Today" : tab === "week" ? "This Week" : "This Month"}</button>
                        </li>
                    ))}
                  </ul>
              </div>
              {/* Events Content */}
                {
                  loading ? (
                  <p className=" flex items-center text-sm text-gray-500 dark:text-gray-400">
                    Loading events...
                    <span className="ml-4 relative flex size-3">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-75"></span>
                      <span className="relative inline-flex size-3 rounded-full bg-brand-500"></span>
                    </span>
                  </p>
                  ) : events.length > 0 ? (

                    events.map(event => (
                      <div id="default-styled-tab-content">
                        {
                          counts &&
                          <div className="p-4 mb-4 rounded-lg bg-gray-50 dark:bg-gray-800" role="tabpanel">
                            <p className="text-md text-gray-500 dark:text-gray-400">Total Events: <strong className="font-medium text-gray-800 dark:text-white">{counts[activeTab] ?? 0}</strong></p>
                            <p className="pt-4 text-sm text-gray-500 dark:text-gray-400">Events { activeTab === "today" ? "Today" : activeTab === "week" ? "This Week" : "This Month"}</p>
                          </div>
                        }
                          <div className="p-4 mb-4 rounded-lg bg-gray-50 dark:bg-gray-800" role="tabpanel">
                              <p className="text-sm text-gray-500 dark:text-gray-400">Delivery Status: <strong className="font-medium text-gray-800 dark:text-white">{event.deliveryStatus}</strong></p>
                          </div>
                          <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800" id="styled-today" role="tabpanel" aria-labelledby="today-tab">
                              {
                                Object.entries(event.fields).map(([key, value]) => (
                                  <div key={key} className="text-sm text-gray-500 dark:text-gray-400">
                                    <strong className="font-medium text-gray-800 dark:text-white">
                                      {key}
                                    </strong>
                                    <p className="text-sm dark:bg-gray-900 p-2 rounded">{value}</p>
                                  </div>
                                ))
                              }
                          </div>
                      </div>
                    ))

                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">No events found for this period.</p>
                  )
                }
            </div>
          ) : (
            <EmptyCategoryState categoryName={category.name} userEmail={userEmail} />
          )
        }
      </div>
    </MaxWidthWrapper>
  )
}
