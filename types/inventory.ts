import { z } from 'zod'

const BatchInSchema = z.object({
  id: z.string(),
  qty: z.number(),
  expire_date: z.string(),
  unit: z.string(),
  return_status: z.boolean(),
  ph_stock_id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string()
})

const BuyerSchema = z.object({
  id: z.string(),
  code: z.string(),
  buyer_name: z.string(),
  phone: z.string(),
  buyer_expenditure: z.number(),
  prescription: z.boolean(),
  prescription_id: z.null(),
  prescription_code: z.null(),
  payment_method: z.string(),
  tax: z.number(),
  createdAt: z.string(),
  updatedAt: z.string()
});

export const GoodsOutSchema = z.object({
  id: z.string(),
  product_id: z.string(),
  product_name: z.string(),
  code: z.string(),
  qty: z.number(),
  sales_unit: z.string(),
  price: z.number(),
  disc: z.string(),
  total_price: z.number(),
  div_area: z.string(),
  buyer_id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  buyer: BuyerSchema
});

export type DrugsDataBatch = z.infer<typeof BatchInSchema>
export type GoodsOut = z.infer<typeof GoodsOutSchema>