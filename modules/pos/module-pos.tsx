/* eslint-disable react-hooks/exhaustive-deps */
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import CardProduct from "@/components/common/card-product";
import DoctorPrescription from "@/components/common/doctor-prescription";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useProduct from "@/hooks/use-product";
import { Products } from "@/types/products";
import { useEffect, useState } from "react";
// import { Pagination } from "ui"

const ModulePos = () => {
  const { productTotalPage, isLoading, getProductByCurrentPage } = useProduct();
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState<Products[]>([]);

  const fetchProductByCurrentPage = async () => {
    const res = await getProductByCurrentPage(currentPage);
    if (Array.isArray(res)) {
      setProducts(res);
    } else {
      setProducts([]);
    }
  };

  useEffect(() => {
    fetchProductByCurrentPage();
  }, [currentPage]);

  return (
    <div className="space-y-4">
      <Breadcrumbs
        segments={[
          {
            title: "POS",
            href: "/pos",
          },
        ]}
      />
      <div
        className="gap-8"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 3fr",
          alignItems: "start",
          minHeight: "680px",
        }}
      >
        {/* <DoctorPrescription /> */}
        <div className="w-full relative h-full">
          <div
            className="grid gap-4"
            style={{ gridTemplateColumns: "3fr 155px" }}
          >
            <Input className="bg-white" placeholder="Search" />
            <Button>Cari Obat </Button>
          </div>
          <div className="my-4">
            <Button variant={"default"} size={"sm"}>
              Semua Kategori
            </Button>
          </div>

          <div className="grid grid-cols-4 gap-4 pb-4">
            {products?.map((item) => (
              <CardProduct
                key={item.id}
                product_code={item.product_code}
                id={item.id}
                product_name={item.product_name}
                price={item.price_input}
                qty={item.qty}
                sales_unit={item.sales_unit}
                status={false}
                disc={"0%"}
              />
            ))}
          </div>
          <div className="flex justify-center absolute bottom-4 left-0 right-0">
            {/* <Pagination
              count={productTotalPage}
              page={currentPage}
              color="standard"
              size='medium'
              onChange={(e, page) => setCurrentPage(page)}
              sx={{
                color: '#fff',
                '& .MuiPaginationItem-text': { color: '#E05E46' },
                '& .MuiPaginationItem': {
                  background: '#fff',
                },
                '& .MuiPaginationItem-root': {
                  background: '#fff',
                },
                '& .Mui-selected': {
                  backgroundColor: '#fff',
                  '&:hover': { color: '#E05E46', backgroundColor: '#fff' }
                },
              }}
            /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModulePos;
