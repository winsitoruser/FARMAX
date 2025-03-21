import React from 'react'
import Footer from '../footer'
import Navbar from '../navbar'
import Sidebar from "../sidebar"
import useSidebar from '@/hooks/use-sidebar'
import { cn } from '@/lib/utils'

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { isOpen, toggle } = useSidebar();

  return (
    <>
      <div className='flex'>
        <Sidebar />
        <div
          className={cn(
            `flex flex-col`,
            isOpen ? "w-[77%]" : "w-[100%]"
          )}
        >
          <Navbar />
          <main className="w-[1300px] mx-auto p-8 h-calc-vh overflow-y-scroll">{children}</main>
          {/* <Footer /> */}
        </div>
      </div>
    </>
  )
}

export default Layout