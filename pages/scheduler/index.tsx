import Layout from '@/components/shared/layout'
import SchedulerModule from '@/modules/scheduler/scheduler-module'
import React from 'react'
import dynamic from 'next/dynamic'

const SchedulerPage = () => {
  return (
    <Layout>
      <SchedulerModule />
    </Layout>
  )
}

export default SchedulerPage