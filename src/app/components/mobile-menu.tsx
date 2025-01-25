"use client"

import { Menu, PanelTopOpen } from 'lucide-react'
import React, { useState } from 'react'

export default function MobileMenu({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => setIsOpen((prev) => !prev);
  const closeDrawer = () => setIsOpen(false);

  return (
    <div>
      <div className="text-center lg:hidden">
        <button onClick={toggleDrawer} className="overflow-y-auto text-black font-medium text-sm px-5 py-2.5 mb-2 dark:text-white dark:hover:text-gray-200 focus:outline-none" type="button" data-drawer-target="drawer-top" data-drawer-show="drawer-top" data-drawer-placement="top" aria-controls="drawer-top">
          <Menu />
        </button>
      </div>
      {/* <!-- drawer component --> to open change from -translate-y-full to translate-y-0*/}
      <div id="drawer-top" className={`fixed top-0 left-0 right-0 z-40 w-full p-4 transition-transform ${isOpen ? "-translate-y-0" : "-translate-y-full"} bg-white dark:bg-gray-800 border-b-4 border-brand-700 aria-labelledby="drawer-top-label`} aria-hidden={!isOpen}>
          <h5 id="drawer-top-label" className="inline-flex items-center mb-4 text-base font-semibold text-gray-500 dark:text-gray-400">
            <PanelTopOpen className='size-4 mr-2' />
            menu
          </h5>
          <button onClick={closeDrawer} type="button" data-drawer-hide="drawer-top" aria-controls="drawer-top" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 absolute top-2.5 end-2.5 inline-flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white" >
            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
            </svg>
            <span className="sr-only">Close menu</span>
          </button>
          { children }
      </div>
    </div>
  )
}
