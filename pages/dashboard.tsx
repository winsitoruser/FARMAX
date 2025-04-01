import React from "react";
import type { NextPage } from "next";
import FarmanesiaDashboardLayout from "@/components/layouts/farmanesia-dashboard-layout";
import DashboardPage from "@/modules/dashboard/module-dashboard";
import styles from '@/styles/dashboard.module.css';

const Dashboard: NextPage = () => {
  return (
    <FarmanesiaDashboardLayout title="FARMAX - Dashboard">
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          Dashboard Header
        </div>
        <DashboardPage />
      </div>
    </FarmanesiaDashboardLayout>
  );
};

export default Dashboard;
