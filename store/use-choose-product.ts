import { Products } from '@/types/products';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

type Product = {
  id: string,
  product_code: string,
  product_name: string,
  sales_unit: string,
  type: string,
  qty: number,
  price_output: number,
  print_barcode: number
}

type PropsTypes = {
  pickProduct: Products[];
  picked: (data: Products) => void;
  reset: () => void;
  removeById: (id: string) => void;
  toPrint: Product[];
  updateInputField: (productCode: string, printBarcode: number) => void;
  resetToPrint: () => void
};

const useChooseProduct = create<PropsTypes>()(
  devtools(
    persist(
      (set) => ({
        pickProduct: [],
        toPrint: [],
        picked: (data) => {
          set((state) => {
            const existingProductIndex = state.pickProduct.findIndex(
              (product) => product.product_code === data.product_code
            );

            if (existingProductIndex !== -1) {
              // If a product with the same product_code already exists, update it
              const updatedPickProduct = [...state.pickProduct];
              updatedPickProduct[existingProductIndex] = data;

              return {
                ...state,
                pickProduct: updatedPickProduct,
              };
            } else {
              // If the product is not found, add it to the array
              const updatedPickProduct = [...state.pickProduct, data];

              return {
                ...state,
                pickProduct: updatedPickProduct,
              };
            }
          });
        },
        reset: () => {
          set({ pickProduct: [] })
        },
        removeById: (id) => {
          set((state) => {
            const updatedPickProduct = state.pickProduct.filter((item) => item.id !== id);
            return {
              ...state,
              pickProduct: updatedPickProduct
            }
          })
        },
        updateInputField: (productCode, printBarcode) => {
          set((state) => {
            const existingIndex = state.toPrint.findIndex((item) => item.product_code === productCode);

            if (existingIndex !== -1) {
              const updatedToPrint = state.toPrint.map((item, index) => {
                if (index === existingIndex) {
                  return {
                    ...item,
                    print_barcode: printBarcode,
                  };
                }
                return item;
              });

              return {
                ...state,
                toPrint: updatedToPrint,
              };
            } else {
              // Find the corresponding product by product_code
              const product = state.pickProduct.find((product) => product.product_code === productCode);

              if (!product) {
                // Product not found, return the state as-is
                return state;
              }

              const newInputField = {
                id: product.id,
                product_code: productCode,
                product_name: product.product_name,
                print_barcode: printBarcode,
                type: product.type,
                sales_unit: product.sales_unit,
                qty: product.qty,
                price_output: product.price_output,

              };

              return {
                ...state,
                toPrint: [...state.toPrint, newInputField],
              };
            }
          });
        },
        resetToPrint: () => {
          set((state) => ({
            ...state,
            toPrint: [],
          }));
        }

      }),
      {
        name: 'choose-product',
      }
    ),
    {
      name: 'choose-product',
      store: 'choose-product',
      features: { dispatch: true, persist: true, jump: true }
    }
  )
);

export default useChooseProduct;
