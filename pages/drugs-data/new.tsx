import Layout from "@/components/shared/layout"
import { BASE_URL } from "@/lib/constants";
import ModuleNewDrugsData from "@/modules/drugs-data/module-new-drugs-data"
import { Supplier } from "@/types/supplier";
import React from "react";

interface Props {
  suppliers: any[];
  types: any[],
  category: any[],
  salesUnit: any[],
  purchase: any[]
}

const NewDrugsData = () => {
  return (
    <Layout>
      <ModuleNewDrugsData />
    </Layout>
  )
}

// export async function getServerSidePropsgetServerSideProps(context: any): Promise<{ props: Props } | { notFound: boolean }> {
//   try {
//     const [res, resType, resUnit, resPurchase, resCategory] = await Promise.all([
//       fetch(`${BASE_URL}/supplier`),
//       fetch(`${BASE_URL}/MD/prod_type`),
//       fetch(`${BASE_URL}/MD/sales_unit`),
//       fetch(`${BASE_URL}/MD/purchase`),
//       fetch(`${BASE_URL}/MD/category`),
//     ]);

//     const [suppliers, types, salesUnit, purchase, category] = await Promise.all([
//       res.json(),
//       resType.json(),
//       resUnit.json(),
//       resPurchase.json(),
//       resCategory.json(),
//     ]);

//     return {
//       props: {
//         suppliers,
//         types,
//         salesUnit,
//         purchase,
//         category,
//       },
//     };
//   } catch (error) {
//     return {
//       notFound: true,
//     };
//   }
// }
export default NewDrugsData