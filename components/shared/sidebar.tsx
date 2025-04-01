import Link from 'next/link'
import { useRouter } from 'next/router'
import { 
  FaHome, 
  FaShoppingCart, 
  FaBoxes, 
  FaUsers, 
  FaChartLine, 
  FaCog, 
  FaSignOutAlt,
  FaMoneyBillWave,
  FaTruck
} from 'react-icons/fa'

const Sidebar = () => {
  const router = useRouter()
  
  const menuItems = [
    { icon: FaHome, label: 'Dashboard', path: '/dashboard' },
    { icon: FaShoppingCart, label: 'POS', path: '/pos' },
    { icon: FaBoxes, label: 'Inventory', path: '/inventory' },
    { icon: FaTruck, label: 'Pemesanan', path: '/purchasing' },
    { icon: FaMoneyBillWave, label: 'Finance', path: '/finance' },
    { icon: FaUsers, label: 'Customers', path: '/customers' },
    { icon: FaChartLine, label: 'Reports', path: '/reports' },
    { icon: FaCog, label: 'Settings', path: '/settings' },
  ]

  return (
    <div className="w-64 bg-gradient-to-b from-orange-600 to-amber-700 text-white flex flex-col">
      <div className="p-4 border-b border-amber-800">
        <h1 className="text-2xl font-bold">FARMAX</h1>
        <p className="text-sm opacity-75">Pharmacy Management System</p>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon
            const isActive = router.pathname === item.path || router.pathname.startsWith(`${item.path}/`)
            
            return (
              <li key={index}>
                <Link href={item.path}>
                  <div className={`flex items-center p-2 rounded-md transition-colors cursor-pointer ${
                    isActive ? 'bg-gradient-to-r from-orange-500 to-amber-500' : 'hover:bg-orange-700'
                  }`}>
                    <Icon className="mr-3 text-lg" />
                    <span>{item.label}</span>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-amber-800">
        <button className="flex items-center w-full p-2 rounded-md hover:bg-orange-700 transition-colors">
          <FaSignOutAlt className="mr-3 text-lg" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}

export default Sidebar
