import { StatsCard } from "./StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, DollarSign, TrendingUp, Activity, Calendar } from "lucide-react";

export function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to MediCare Hospital Management System
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Patients"
          value="1,284"
          icon={Users}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Today's Revenue"
          value="$24,580"
          icon={DollarSign}
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Pending Bills"
          value="47"
          icon={FileText}
          trend={{ value: -3, isPositive: false }}
        />
        <StatsCard
          title="Active Services"
          value="156"
          icon={Activity}
          trend={{ value: 5, isPositive: true }}
        />
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Today's Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32</div>
            <p className="text-sm text-muted-foreground">8 pending, 24 completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-accent" />
              Monthly Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$485,230</div>
            <p className="text-sm text-muted-foreground">+15% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Inpatients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <p className="text-sm text-muted-foreground">5 admitted today</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { time: "10:30 AM", activity: "New patient registered: John Smith", type: "patient" },
              { time: "09:45 AM", activity: "Bill paid: Invoice #INV-2024-001", type: "payment" },
              { time: "09:15 AM", activity: "Lab test completed: Blood Test", type: "service" },
              { time: "08:30 AM", activity: "Patient discharged: Room 205", type: "discharge" },
            ].map((item, index) => (
              <div key={index} className="flex items-center space-x-4 text-sm">
                <div className="w-16 text-muted-foreground">{item.time}</div>
                <div className="flex-1">{item.activity}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}