import Layout from '@/components/shared/layout'
import { initialOpnameId } from '@/data/opname-id'
import useOpname from '@/hooks/use-opname'
import DetailStockOpname from '@/modules/stock-opname/detail-stock-opname'
import { RetriveOpnameId } from '@/types/opname'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const StockOpnameId = () => {
  const [opname, setOpname] = useState<RetriveOpnameId>(initialOpnameId)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { getOpnameById } = useOpname()

  const fetchData = async () => {
    setLoading(true)
    const res = await getOpnameById(router.query.id as string)
    console.log(res)
    if (res.data) {
      // Type assertion to handle the API response structure
      const responseData = res.data as any;
      
      // Create a properly typed object with all required fields
      const opnameData: RetriveOpnameId = {
        ...initialOpnameId,
        ...responseData,
        // Ensure batch property exists
        batch: responseData.batch || initialOpnameId.batch
      };
      
      setOpname(opnameData);
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.id])

  return (
    <Layout>
      <DetailStockOpname opname={opname} loading={loading} />
    </Layout>
  )
}

export default StockOpnameId