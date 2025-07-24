import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Search, Activity, DollarSign, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MedicalService {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  status: "active" | "inactive";
}

const mockServices: MedicalService[] = [
  {
    id: "SRV001",
    name: "General Consultation",
    category: "Consultation",
    price: 100,
    description: "Basic medical consultation with doctor",
    status: "active"
  },
  {
    id: "SRV002",
    name: "Blood Test - Complete",
    category: "Laboratory",
    price: 75,
    description: "Complete blood count analysis",
    status: "active"
  },
  {
    id: "SRV003",
    name: "X-Ray Chest",
    category: "Radiology",
    price: 150,
    description: "Chest X-ray examination",
    status: "active"
  },
  {
    id: "SRV004",
    name: "CT Scan Brain",
    category: "Radiology", 
    price: 500,
    description: "Brain CT scan with contrast",
    status: "active"
  },
  {
    id: "SRV005",
    name: "ECG",
    category: "Cardiology",
    price: 50,
    description: "Electrocardiogram test",
    status: "active"
  }
];

const categories = ["All", "Consultation", "Laboratory", "Radiology", "Cardiology", "Surgery"];

export function MedicalServices() {
  const [services] = useState<MedicalService[]>(mockServices);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showAddForm, setShowAddForm] = useState(false);

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Medical Services</h1>
          <p className="text-muted-foreground">Manage hospital services and pricing</p>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add New Service
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search services by name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Services Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredServices.map((service) => (
          <Card key={service.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">{service.name}</CardTitle>
                </div>
                <Badge variant={service.status === "active" ? "default" : "secondary"}>
                  {service.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Category</p>
                  <Badge variant="outline">{service.category}</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Price</p>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4 text-accent" />
                    <span className="text-lg font-semibold">{service.price}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Description</p>
                  <p className="text-sm">{service.description}</p>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1 gap-1">
                    <Edit className="h-3 w-3" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 gap-1">
                    <Trash2 className="h-3 w-3" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Service Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Add New Service</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="serviceName">Service Name</Label>
                <Input id="serviceName" placeholder="Enter service name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select className="w-full h-10 px-3 py-2 text-sm bg-background border border-input rounded-md">
                  <option value="">Select category</option>
                  <option value="Consultation">Consultation</option>
                  <option value="Laboratory">Laboratory</option>
                  <option value="Radiology">Radiology</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Surgery">Surgery</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input id="price" type="number" placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input id="description" placeholder="Service description" />
              </div>
              <div className="flex gap-2 pt-4">
                <Button className="flex-1" variant="medical">
                  Add Service
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowAddForm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}