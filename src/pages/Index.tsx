import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { PatientManagement } from "@/components/patients/PatientManagement";
import { MedicalServices } from "@/components/services/MedicalServices";
import { PharmacyManagement } from "@/components/pharmacy/PharmacyManagement";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "patients":
        return <PatientManagement />;
      case "services":
        return <MedicalServices />;
      case "billing":
        return <div className="p-6"><h1 className="text-3xl font-bold">Billing Module</h1><p className="text-muted-foreground">Coming soon...</p></div>;
      case "pharmacy":
        return <PharmacyManagement />;
      case "inpatient":
        return <div className="p-6"><h1 className="text-3xl font-bold">Inpatient Management</h1><p className="text-muted-foreground">Coming soon...</p></div>;
      case "payments":
        return <div className="p-6"><h1 className="text-3xl font-bold">Payment Tracking</h1><p className="text-muted-foreground">Coming soon...</p></div>;
      case "reports":
        return <div className="p-6"><h1 className="text-3xl font-bold">Reports</h1><p className="text-muted-foreground">Coming soon...</p></div>;
      case "settings":
        return <div className="p-6"><h1 className="text-3xl font-bold">Settings</h1><p className="text-muted-foreground">Coming soon...</p></div>;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 overflow-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default Index;
