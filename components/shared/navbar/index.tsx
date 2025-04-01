import SheetCart from "@/components/sheet-cart"
import { UserAccountNav } from "./user-account-nav"
import Image from "next/image"
import Link from "next/link"
import { FaHome, FaDesktop, FaBoxes, FaUsers, FaChartLine, FaCog } from "react-icons/fa"

const Navbar = () => {
  return (
    <div className="container mx-auto flex flex-col md:flex-row items-center justify-between h-full px-4">
      {/* Logo and Title */}
      <div className="flex items-center">
        <Link href="/" className="flex items-center">
          <div className="relative h-10 w-10 mr-3">
            <Image 
              src="/logo.svg" 
              alt="FARMAX Logo" 
              fill
              className="object-contain"
            />
          </div>
          <div>
            <h1 className="text-white font-bold text-xl tracking-tight">Farmanesia</h1>
            <p className="text-white text-xs opacity-80">Pharmacy Management System</p>
          </div>
        </Link>
      </div>
      
      {/* Navigation Links */}
      <nav className="flex items-center space-x-1 md:space-x-2">
        <NavLink href="/dashboard" icon={<FaHome />} label="Dashboard" />
        <NavLink href="/pos" icon={<FaDesktop />} label="POS" />
        <NavLink href="/inventory" icon={<FaBoxes />} label="Inventory" />
        <NavLink href="/customers" icon={<FaUsers />} label="Customers" />
        <NavLink href="/reports" icon={<FaChartLine />} label="Reports" />
        <NavLink href="/settings" icon={<FaCog />} label="Settings" />
        
        {/* User actions */}
        <div className="ml-4 flex items-center space-x-3">
          <SheetCart mode="cart" />
          <UserAccountNav />
        </div>
      </nav>
    </div>
  )
}

// Navigation link component with icon
const NavLink = ({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) => {
  return (
    <Link 
      href={href}
      className="flex flex-col items-center justify-center px-3 py-2 text-white hover:bg-white/10 rounded-md transition-colors"
    >
      <div className="text-lg">{icon}</div>
      <span className="text-xs mt-1">{label}</span>
    </Link>
  )
}

export default Navbar