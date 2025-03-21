import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

type ProductToCart = {
  id: string;
  product_name: string;
  product_code: string;
  qty: number;
  price: number;
  disc: string;
  sales_unit: string;
  status: boolean;
}

interface PickedProduct {
  product: ProductToCart;
  amount: number;
  id: number;
}

interface PickedProductState {
  pickedProducts: PickedProduct[];
  totalPrice: number;
  totalTax: number;
  addToCart: (data: ProductToCart, productCode: string) => void;
  deleteAllInCart: () => void;
  setCart: (datas: any[]) => void;
  addAmount: (indexed: number) => void;
  removeAmount: (indexed: number) => void;
  removeItem: (indexed: number) => void;
}

const calculateTotalPriceAndTax = (pickedProducts: PickedProduct[]) => {
  let totalPrice = 0;
  let totalTax = 0;

  pickedProducts.forEach((product) => {
    totalPrice += product.amount * product.product.price;
    totalTax += (product.amount * product.product.price) * 0.1;
  });

  return { totalPrice, totalTax };
};


const usePickedProduct = create<PickedProductState>()(
  devtools(
    persist(
      (set) => ({
        pickedProducts: [],
        totalPrice: 0,
        totalTax: 0,
        addToCart: (data, productCode) => {
          set((state) => {
            const draft = {
              ...state,
              pickedProducts: state.pickedProducts.map((item) => ({ ...item })),
            };

            const existingProduct = draft.pickedProducts.find(
              (item) => item.product.product_code === productCode
            );

            if (existingProduct) {
              existingProduct.amount += 1;
            } else {
              draft.pickedProducts.push({
                product: data,
                amount: 1,
                id: draft.pickedProducts.length === 0 ? 1 : draft.pickedProducts[draft.pickedProducts.length - 1].id + 1,
              });
            }

            const { totalPrice, totalTax } = calculateTotalPriceAndTax(draft.pickedProducts);
            draft.totalPrice = totalPrice;
            draft.totalTax = totalTax;

            return draft;
          });
        },

        deleteAllInCart: () => {
          set(() => ({
            pickedProducts: [],
            totalPrice: 0,
            totalTax: 0,
          }));
        },

        setCart: (datas) => {
          set(() => ({
            pickedProducts: datas.map((item) => ({ ...item })),
          }));
        },

        addAmount: (indexed) => {
          set((state) => {
            const draft = {
              ...state,
              pickedProducts: state.pickedProducts.map((item) => ({ ...item })),
            };

            if (indexed >= 0 && indexed < draft.pickedProducts.length) {
              draft.pickedProducts[indexed].amount += 1;
              const { totalPrice, totalTax } = calculateTotalPriceAndTax(draft.pickedProducts);
              draft.totalPrice = totalPrice;
              draft.totalTax = totalTax;
            }

            return draft;
          });
        },

        removeAmount: (indexed: number) => {
          set((state: PickedProductState) => {
            const draft = {
              ...state,
              pickedProducts: state.pickedProducts.map((item) => ({ ...item })),
            };

            console.log(draft.pickedProducts);
            console.log({ indexed });

            if (indexed >= 0 && indexed < draft.pickedProducts.length) {
              draft.pickedProducts[indexed].amount -= 1;

              if (draft.pickedProducts[indexed].amount <= 0) {
                // If the amount becomes zero or negative, remove the product
                draft.pickedProducts.splice(indexed, 1);
              }

              if (draft.pickedProducts.length === 0) {
                // If there are no more products in the cart, reset the total values
                draft.totalPrice = 0;
                draft.totalTax = 0;
              } else {
                const { totalPrice, totalTax } = calculateTotalPriceAndTax(draft.pickedProducts);
                draft.totalPrice = totalPrice;
                draft.totalTax = totalTax;
              }
            }

            return draft;
          });
        },

        removeItem: (indexed) => {
          set((state) => {
            const draft = {
              ...state,
              pickedProducts: state.pickedProducts.map((item) => ({ ...item })),
            };

            if (indexed >= 0 && indexed < draft.pickedProducts.length) {
              const removedProduct = draft.pickedProducts[indexed];
              if (draft.pickedProducts.length === 1) {
                draft.pickedProducts = [];
              } else {
                draft.pickedProducts = draft.pickedProducts.filter((item) => item.id !== removedProduct.id);
              }
              const { totalPrice, totalTax } = calculateTotalPriceAndTax(draft.pickedProducts);
              draft.totalPrice = totalPrice;
              draft.totalTax = totalTax;
            }

            return draft;
          });
        },




      }),
      { name: 'cart' }
    ),
    {
      name: 'cart',
      store: 'cart',
      features: {
        dispatch: true,
        persist: true,
        jump: true,
      },
      trace: true,
    }
  )
);

export default usePickedProduct;
