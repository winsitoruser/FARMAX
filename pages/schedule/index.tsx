import React from 'react';
import SchedulerLayout from '@/components/layouts/scheduler-layout';
import SchedulerModule from '@/modules/scheduler/scheduler-module';
import Head from 'next/head';

const SchedulePage = () => {
  return (
    <SchedulerLayout>
      <Head>
        <title>Manajemen Jadwal Shift - FARMAX</title>
        <meta name="description" content="Kelola jadwal shift karyawan apotek FARMAX" />
      </Head>
      <SchedulerModule />
    </SchedulerLayout>
  )
}

export default SchedulePage
