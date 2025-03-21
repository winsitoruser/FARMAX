import { Icons } from "@/components/common/Icons";
import CardStaffPharmacy from "@/components/common/card-staff-pharmacy";
import Pagination from "@/components/common/pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useStaff from "@/hooks/use-staff";
import Link from "next/link";

import { useState } from "react";

const ModuleStaff = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { staff } = useStaff();
  const itemsPerPage = 9;
  const lastPage = Math.ceil(staff.filter(item => item.active_status === true).length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = currentPage * itemsPerPage;
  const currentStaff = staff.filter(item => item.active_status === true).slice(startIndex, endIndex);
  return (
    <div>
      <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
        <Input className="w-[400px] bg-white" placeholder="Cari Staff" />
        <Button size={'sm'}>
          <Link href="/staff/new" prefetch={false} className="flex items-center space-x-2">
            <Icons.add size={18} /><span>Tambah Petugas</span>
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-3 gap-6">
        {currentStaff.map((item) => (
          <CardStaffPharmacy
            key={item.id}
            id={item.id}
            first_name={item.first_name}
            last_name={item.last_name}
            image_id={item.image_id}
            role={item.role}
          />
        ))}
      </div>
      <div className="flex justify-center mt-8">

        <Pagination
          currentPage={currentPage}
          lastPage={lastPage}
          maxLength={3}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default ModuleStaff;
