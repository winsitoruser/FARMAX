import DrugsDataLoading from '@/components/drug-data/drugs-detail-loading';
import { DataTableLoading } from '@/components/table/data-table-loading';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import useBuyer from '@/hooks/use-buyer';
import useProduct from '@/hooks/use-product';
import { cn } from '@/lib/utils';
import { GoodsOut } from '@/types/inventory';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

const ModuleGoodsOut = dynamic(() => import('@/modules/drugs-data/goods-out'));
const ProductInformation = dynamic(() => import('@/components/drug-data/product-information'));
const DrugsDataBatch = dynamic(() => import('@/components/goods-in/drugs-data-in'));
const CardObat = dynamic(() => import('@/components/common/card-obat'));


const ModuleObatDetail = () => {

  const { getBuyerById } = useBuyer();
  const { getProductById } = useProduct();
  const [loading, setLoading] = useState(true);
  const [goods, setGoods] = useState<GoodsOut[]>([]);
  const [product, setProduct] = useState({
    id: "",
    product_name: "",
    admin: '',
    product_code: "",
    retail: false,
    price_input: 0,
    price_output: 0,
    profit: "",
    sales_unit: "",
    purchase_unit: "",
    type: "",
    form: "",
    typical: "",
    posologi: '',
    composition: [
      { name: "", value: "" },
    ],
    side_effect: "",
    indication: "",
    how_to_use: '',
    drug_interactions: "",
    dose: "",
    attention: "",
    contraindication: '',
    buffer_stock: 0,
    manufacturer: "",
    supplier_id: "",
    createdAt: "",
    updatedAt: "",
    qty: 0,
    batch: [],
  });
  const router = useRouter();

  const fetchProduct = async () => {
    try {
      const slug = Array.isArray(router.query?.slug) ? router.query?.slug[0] : router.query?.slug || "";
      const res = await getProductById(slug);
      if (res.data) {
        setProduct(res.data);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchGoods = async () => {
    try {
      const slug = Array.isArray(router.query?.slug) ? router.query?.slug[0] : router.query?.slug || "";
      const res = await getBuyerById(slug);
      if (res.data) {
        setGoods(res.data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (router.isReady) {
      setLoading(true);
      fetchGoods();
      fetchProduct();
    }
  }, [router.query.slug]);

  if (loading) return <DrugsDataLoading />

  return (
    <div
      style={{
        display: "grid",
        gap: "1rem",
        gridTemplateColumns: "1fr 2.5fr",
        alignItems: "start",
      }}
    >
      <div className='flex flex-col gap-4'>
        <CardObat typical={product?.typical} type={product?.type} product_code={product?.product_code} product_name={product?.product_name} form={product?.form} price_output={product?.price_output} manufacturer={product?.manufacturer} />
        <Card>
          <CardContent className='pt-6'>
            <div className="grid grid-cols-2">
              <div className='flex flex-col items-center' style={{ borderRight: '1px #ddd solid' }}>
                <p className='text-slate-400 text-sm'>Stok Saat Ini</p>
                <p className='text-xl mt-2 font-semibold'>{product?.qty}</p>
              </div>
              <div className='flex flex-col items-center'>
                <p className='text-slate-400 text-sm'>Batas Stok</p>
                <p className={cn('text-xl mt-2 font-semibold', product?.qty === 0 ? 'text-red-400' : product?.qty > 0 && product?.qty <= product?.buffer_stock ? 'text-amber-400' : 'text-green-400')}>{product?.buffer_stock}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <div className="flex justify-between p-6">
            <Label>PIC</Label>
            <Label className='capitalize'>{product?.admin}</Label>
          </div>
        </Card>
      </div>
      <Tabs defaultValue="info" className="w-full">
        <TabsList className="grid w-full grid-cols-4 border">
          <TabsTrigger value="info" className='bg-cyan-900'>Informasi Produk</TabsTrigger>
          <TabsTrigger value="in">Barang Masuk</TabsTrigger>
          <TabsTrigger value="out">Barang Keluar</TabsTrigger>
          <TabsTrigger value="opname">Stock Opname</TabsTrigger>
        </TabsList>
        <TabsContent value="info">
          <ProductInformation dosage={product?.dose}
            indication={product?.indication}
            ingredients={product?.composition}
            posology={product?.posologi}
            sideEffects={product?.side_effect} />
        </TabsContent>
        <TabsContent value="in">
          {!product?.batch ? <DataTableLoading columnCount={6} isNewRowCreatable={true} rowCount={6} /> :
            <DrugsDataBatch data={product?.batch} />
          }
        </TabsContent>
        <TabsContent value="out">
          {goods ?
            <ModuleGoodsOut data={goods} />
            :
            <DataTableLoading columnCount={6} isNewRowCreatable={true} rowCount={6} />
          }
        </TabsContent>
        <TabsContent value="opname">

        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ModuleObatDetail