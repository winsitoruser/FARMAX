import React from 'react';
import SchedulerLayout from '@/components/layouts/scheduler-layout';
import ShiftTemplateModule from '@/modules/scheduler/shift-template-module';
import Head from 'next/head';

const ShiftTemplatePage = () => {
  return (
    <SchedulerLayout>
      <Head>
        <title>Template Jadwal Shift - FARMAX</title>
        <meta name="description" content="Kelola template jadwal shift karyawan di apotek FARMAX" />
      </Head>
      <ShiftTemplateModule />
    </SchedulerLayout>
  )
}

export default ShiftTemplatePage
