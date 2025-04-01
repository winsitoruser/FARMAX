import PosLayout from "@/components/layouts/pos-layout";
import { Breadcrumbs } from "@/components/common/breadcrumbs";

const WishlistPage = () => {
  return (
    <PosLayout>
      <div className="space-y-6">
        <Breadcrumbs
          segments={[
            {
              title: "POS",
              href: "/pos",
            },
            {
              title: "Wishlist",
              href: "/pos/wishlist",
            },
          ]}
        />
        
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">Wishlist</h1>
          <p className="text-gray-600">Halaman ini akan menampilkan daftar wishlist produk.</p>
        </div>
      </div>
    </PosLayout>
  );
};

export default WishlistPage;
