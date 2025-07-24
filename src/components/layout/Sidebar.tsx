import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  FileText, 
  Activity, 
  Pill, 
  Bed, 
  CreditCard, 
  BarChart3, 
  Settings,
  Menu,
  X,
  Hospital,
  ChevronRight
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const menuItems = [
  { id: "dashboard", icon: BarChart3, label: "Dashboard" },
  { id: "patients", icon: Users, label: "Patients" },
  { id: "services", icon: Activity, label: "Medical Services" },
  { id: "billing", icon: FileText, label: "Billing" },
  { id: "pharmacy", icon: Pill, label: "Pharmacy" },
  { id: "inpatient", icon: Bed, label: "Inpatient" },
  { id: "payments", icon: CreditCard, label: "Payments" },
  { id: "reports", icon: BarChart3, label: "Reports" },
  { id: "settings", icon: Settings, label: "Settings" },
];

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={cn(
        "bg-sidebar text-sidebar-foreground transition-all duration-300 flex flex-col border-r border-sidebar-border",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <Hospital className="h-8 w-8 text-primary" />
              <h1 className="text-xl font-bold">MediCare HMS</h1>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-sidebar-foreground hover:bg-sidebar-hover"
          >
            {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <Button
              key={item.id}
              variant="ghost"
              className={cn(
                "w-full justify-start h-11 transition-all duration-200",
                isActive 
                  ? "bg-primary text-primary-foreground hover:bg-primary-hover" 
                  : "text-sidebar-foreground hover:bg-sidebar-hover hover:text-sidebar-foreground",
                isCollapsed ? "px-2" : "px-3"
              )}
              onClick={() => onTabChange(item.id)}
            >
              <IconComponent className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
              {!isCollapsed && (
                <>
                  <span className="flex-1 text-left">{item.label}</span>
                  {isActive && <ChevronRight className="h-4 w-4" />}
                </>
              )}
            </Button>
          );
        })}
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-sidebar-border">
          <div className="text-xs text-sidebar-foreground/60">
            Hospital Management System v1.0
          </div>
        </div>
      )}
    </div>
  );
}