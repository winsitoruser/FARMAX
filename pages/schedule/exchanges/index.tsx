import React from 'react';
import SchedulerLayout from '@/components/layouts/scheduler-layout';
import ShiftExchangeModule from '@/modules/scheduler/shift-exchange-module';
import Head from 'next/head';

const ShiftExchangePage = () => {
  return (
    <SchedulerLayout>
      <Head>
        <title>Penukaran Shift - FARMAX</title>
        <meta name="description" content="Kelola penukaran shift karyawan di apotek FARMAX" />
      </Head>
      <ShiftExchangeModule />
    </SchedulerLayout>
  )
}

export default ShiftExchangePage
