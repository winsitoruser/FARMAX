import Layout from "@/components/shared/layout"
import dynamic from "next/dynamic"

// Use dynamic import with SSR disabled to prevent server-side rendering issues
const DynamicNewStockOpnameModule = dynamic(
  () => import("@/modules/stock-opname/new-stock-opname"),
  { ssr: false }
)

const NewStockOpname = () => {
  return (
    <Layout>
      <DynamicNewStockOpnameModule />
    </Layout>
  )
}

export default NewStockOpname