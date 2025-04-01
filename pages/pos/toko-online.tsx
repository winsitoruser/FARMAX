import PosLayout from "@/components/layouts/pos-layout";
import { Breadcrumbs } from "@/components/common/breadcrumbs";

const TokoOnlinePage = () => {
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
              title: "Toko Online",
              href: "/pos/toko-online",
            },
          ]}
        />
        
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">Toko Online</h1>
          <p className="text-gray-600">Halaman ini akan menampilkan data toko online.</p>
        </div>
      </div>
    </PosLayout>
  );
};

export default TokoOnlinePage;
