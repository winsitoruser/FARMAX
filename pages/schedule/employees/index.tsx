import React from 'react';
import SchedulerLayout from '@/components/layouts/scheduler-layout';
import EmployeeManagementModule from '@/modules/scheduler/employee-management-module';

const EmployeeManagementPage = () => {
  return (
    <SchedulerLayout>
      <EmployeeManagementModule />
    </SchedulerLayout>
  );
};

export default EmployeeManagementPage;
