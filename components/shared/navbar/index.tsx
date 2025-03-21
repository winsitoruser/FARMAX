import SheetCart from "@/components/sheet-cart"
import { UserAccountNav } from "./user-account-nav"
import Image from "next/image"

const Navbar = () => {

  return (
    <header className='px-10 py-3 bg-white h-[80px] flex justify-between items-center sticky top-0 w-full z-50'>
      <div>
        <Image src="https://hostedcontent.dragonforms.com/hosted/images/dragon/12391/773.jpg" alt="Pharmacy Logo2" width={150} height={80} />
      </div>
      <div className="flex items-center space-x-4">
        <div></div>
        <SheetCart mode="cart" />
        <UserAccountNav />
      </div>
    </header>
  )
}

export default Navbar