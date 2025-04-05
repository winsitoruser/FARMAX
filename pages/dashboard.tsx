import React from "react";
import type { NextPage } from "next";
import FarmanesiaDashboardLayout from "@/components/layouts/farmanesia-dashboard-layout";
import DashboardPage from "@/modules/dashboard/module-dashboard";

const Dashboard: NextPage = () => {
  return (
    <FarmanesiaDashboardLayout title="Dashboard">
      <div className="relative min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 h-64 w-64 bg-gradient-to-bl from-orange-400/10 to-amber-300/5 rounded-full blur-3xl -z-0"></div>
        <div className="absolute bottom-0 left-0 h-64 w-64 bg-gradient-to-tr from-orange-500/10 to-amber-400/5 rounded-full blur-3xl -z-0"></div>
        <div className="absolute top-1/2 left-1/3 h-64 w-64 bg-gradient-to-tr from-amber-500/10 to-orange-400/5 rounded-full blur-3xl -z-0"></div>
        
        {/* Main content - removed top padding to move content closer to header */}
        <div className="relative z-10 pt-0 px-4">
          <DashboardPage />
        </div>
      </div>
    </FarmanesiaDashboardLayout>
  );
};

export default Dashboard;
