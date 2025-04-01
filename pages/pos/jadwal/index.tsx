import React from 'react';
import PosLayout from '@/components/layouts/pos-layout';
import { Breadcrumbs } from '@/components/common/breadcrumbs';
import BackButton from '@/components/common/back-button';
import ModuleJadwal from '@/modules/pos/jadwal/module-jadwal';

const JadwalKaryawanPage = () => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <Breadcrumbs items={[
          { label: "POS", href: "/pos" },
          { label: "Jadwal Karyawan", href: "/pos/jadwal" }
        ]} />
        <BackButton href="/pos" />
      </div>
      
      <div className="bg-white rounded-lg shadow p-4 flex-1">
        <ModuleJadwal />
      </div>
    </div>
  );
};

// Define layout for this page
JadwalKaryawanPage.getLayout = function getLayout(page: React.ReactNode) {
  return <PosLayout>{page}</PosLayout>;
};

export default JadwalKaryawanPage;
