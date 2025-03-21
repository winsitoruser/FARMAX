import { ProductWithoutBatch } from "@/types/products";
import { ProductInfo } from "@/types/order";

export const initialProductInfo: ProductInfo = {
  product_id: '',
  product_name: "",
  product_code: "",
  profit: "10%",
  price: 0,
  purchase_unit: "",
  type: "",
  typical: "",
  qty: 0,
  price_total: 0,
  supplier_id: '',
  unit: '',
}
export const initialDefectaProduct: ProductWithoutBatch = {
  id: "",
  admin: "admin",
  product_name: "",
  product_code: "",
  retail: false,
  price_input: 0,
  price_output: 0,
  profit: "10%",
  posologi: '',
  sales_unit: "",
  purchase_unit: "",
  type: "",
  form: "",
  typical: "",
  composition: [
    {
      name: "",
      value: ""
    },

  ],
  side_effect: "",
  indication: "",
  how_to_use: null,
  drug_interactions: "",
  dose: "",
  attention: "",
  contraindication: null,
  buffer_stock: 0,
  manufacturer: "",
  supplier_id: "",
}