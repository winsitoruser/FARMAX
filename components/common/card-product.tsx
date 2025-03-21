import { Button } from "@/components/ui/button"
import { formatRupiah } from "@/lib/formatter"
import usePickedProduct from "@/store/use-picked-product"
import { ProductToCart } from "@/types/order"
import { MdShoppingCart } from "./Icons"



const CardProduct: React.FC<ProductToCart> = ({ id, product_code, product_name, price, status, qty, sales_unit, disc }) => {
  const { addToCart } = usePickedProduct()

  const handleToCart = (product: ProductToCart) => {
    addToCart(product, product.product_code)
  }

  const data = { id, product_code, product_name, disc, price, status, qty, sales_unit }

  return (
    <div className='p-4 rounded-lg bg-white'>
      <div className="flex">
        <div className="space-y-1">
          <p className="text-sm font-semibold">{product_name}</p>
          <p className="text-sm text-slate-600">{formatRupiah(price || 0)}</p>
          <div className="text-xs capitalize"><span className="text-slate-600">Per</span> <span className="font-medium">{sales_unit}</span></div>
        </div>
        </div>
      <div className="grid items-center gap-1 mt-1" style={{ gridTemplateColumns: '5fr 1fr' }}>
        <div className="text-slate-800 text-sm font-medium flex items-center">
          <div className="text-xs capitalize">Stok : {qty === 0 ? <span className="text-red-400">Stok Habis</span> : `${qty} ${sales_unit}`} </div>
        </div>
        <Button variant={'ghost'} size={'icon'} className="rounded-full bg-primary text-white" onClick={() => handleToCart(data)} disabled={qty === 0}>
          <MdShoppingCart />
        </Button>
      </div>
    </div>
  )
}

export default CardProduct