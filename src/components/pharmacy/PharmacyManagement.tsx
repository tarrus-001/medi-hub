import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Edit, Package, AlertTriangle, TrendingUp, TrendingDown, Pill } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface Medicine {
  id: string;
  name: string;
  category: string;
  manufacturer: string;
  batchNumber: string;
  expiryDate: string;
  costPrice: number;
  sellingPrice: number;
  currentStock: number;
  minStockLevel: number;
  maxStockLevel: number;
  description?: string;
  status: "active" | "inactive" | "discontinued";
}

interface StockTransaction {
  id: string;
  medicineId: string;
  type: "purchase" | "sale" | "adjustment" | "expired";
  quantity: number;
  date: string;
  notes?: string;
}

export function PharmacyManagement() {
  const [medicines, setMedicines] = useState<Medicine[]>([
    {
      id: "1",
      name: "Paracetamol 500mg",
      category: "Analgesic",
      manufacturer: "ABC Pharma",
      batchNumber: "PAR001",
      expiryDate: "2025-12-31",
      costPrice: 0.50,
      sellingPrice: 1.00,
      currentStock: 150,
      minStockLevel: 50,
      maxStockLevel: 500,
      description: "Pain relief and fever reducer",
      status: "active"
    },
    {
      id: "2",
      name: "Amoxicillin 250mg",
      category: "Antibiotic",
      manufacturer: "XYZ Pharma",
      batchNumber: "AMX002",
      expiryDate: "2025-06-30",
      costPrice: 2.00,
      sellingPrice: 3.50,
      currentStock: 25,
      minStockLevel: 30,
      maxStockLevel: 200,
      description: "Broad-spectrum antibiotic",
      status: "active"
    },
    {
      id: "3",
      name: "Insulin Glargine",
      category: "Antidiabetic",
      manufacturer: "DiabCare Inc",
      batchNumber: "INS003",
      expiryDate: "2024-03-15",
      costPrice: 25.00,
      sellingPrice: 45.00,
      currentStock: 8,
      minStockLevel: 10,
      maxStockLevel: 50,
      description: "Long-acting insulin",
      status: "active"
    }
  ]);

  const [stockTransactions, setStockTransactions] = useState<StockTransaction[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isStockDialogOpen, setIsStockDialogOpen] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);

  const form = useForm<Medicine>({
    defaultValues: {
      name: "",
      category: "",
      manufacturer: "",
      batchNumber: "",
      expiryDate: "",
      costPrice: 0,
      sellingPrice: 0,
      currentStock: 0,
      minStockLevel: 0,
      maxStockLevel: 0,
      description: "",
      status: "active"
    }
  });

  const stockForm = useForm({
    defaultValues: {
      type: "purchase",
      quantity: 0,
      notes: ""
    }
  });

  const categories = Array.from(new Set(medicines.map(m => m.category)));
  
  const filteredMedicines = medicines.filter(medicine => {
    const matchesSearch = medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         medicine.manufacturer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || medicine.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const lowStockMedicines = medicines.filter(m => m.currentStock <= m.minStockLevel);
  const expiringSoon = medicines.filter(m => {
    const expiryDate = new Date(m.expiryDate);
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
    return expiryDate <= threeMonthsFromNow;
  });

  const totalValue = medicines.reduce((sum, med) => sum + (med.currentStock * med.costPrice), 0);

  const onSubmit = (data: Medicine) => {
    if (selectedMedicine) {
      setMedicines(prev => prev.map(med => 
        med.id === selectedMedicine.id ? { ...data, id: selectedMedicine.id } : med
      ));
      toast.success("Medicine updated successfully");
    } else {
      const newMedicine = { ...data, id: Date.now().toString() };
      setMedicines(prev => [...prev, newMedicine]);
      toast.success("Medicine added successfully");
    }
    setIsAddDialogOpen(false);
    setSelectedMedicine(null);
    form.reset();
  };

  const onStockUpdate = (data: any) => {
    if (!selectedMedicine) return;
    
    const transaction: StockTransaction = {
      id: Date.now().toString(),
      medicineId: selectedMedicine.id,
      type: data.type,
      quantity: Number(data.quantity),
      date: new Date().toISOString(),
      notes: data.notes
    };

    setStockTransactions(prev => [...prev, transaction]);
    
    setMedicines(prev => prev.map(med => {
      if (med.id === selectedMedicine.id) {
        let newStock = med.currentStock;
        if (data.type === "purchase" || data.type === "adjustment") {
          newStock += Number(data.quantity);
        } else if (data.type === "sale" || data.type === "expired") {
          newStock -= Number(data.quantity);
        }
        return { ...med, currentStock: Math.max(0, newStock) };
      }
      return med;
    }));

    toast.success("Stock updated successfully");
    setIsStockDialogOpen(false);
    setSelectedMedicine(null);
    stockForm.reset();
  };

  const getStockStatus = (medicine: Medicine) => {
    if (medicine.currentStock <= medicine.minStockLevel) {
      return { status: "Low Stock", variant: "destructive" as const };
    }
    if (medicine.currentStock >= medicine.maxStockLevel) {
      return { status: "Overstocked", variant: "secondary" as const };
    }
    return { status: "Normal", variant: "default" as const };
  };

  const openEditDialog = (medicine: Medicine) => {
    setSelectedMedicine(medicine);
    form.reset(medicine);
    setIsAddDialogOpen(true);
  };

  const openStockDialog = (medicine: Medicine) => {
    setSelectedMedicine(medicine);
    setIsStockDialogOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Pharmacy Management</h1>
          <p className="text-muted-foreground">Manage medicines, inventory, and stock levels</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setSelectedMedicine(null);
              form.reset();
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Medicine
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedMedicine ? "Edit Medicine" : "Add New Medicine"}</DialogTitle>
              <DialogDescription>
                {selectedMedicine ? "Update medicine information" : "Enter medicine details to add to inventory"}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Medicine Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter medicine name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Analgesic, Antibiotic" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="manufacturer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Manufacturer</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter manufacturer name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="batchNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Batch Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter batch number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="expiryDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expiry Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="discontinued">Discontinued</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="costPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cost Price ($)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01" 
                            placeholder="0.00" 
                            {...field}
                            onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="sellingPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Selling Price ($)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01" 
                            placeholder="0.00" 
                            {...field}
                            onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="currentStock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Stock</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="0" 
                            {...field}
                            onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="minStockLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minimum Stock Level</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="0" 
                            {...field}
                            onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="maxStockLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maximum Stock Level</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="0" 
                            {...field}
                            onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter medicine description (optional)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">
                    {selectedMedicine ? "Update Medicine" : "Add Medicine"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Medicines</CardTitle>
            <Pill className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{medicines.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{lowStockMedicines.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <TrendingDown className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{expiringSoon.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inventory Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Medicine Inventory</CardTitle>
          <CardDescription>Search and manage your medicine inventory</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search medicines..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Medicine</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Batch</TableHead>
                  <TableHead>Expiry</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Cost Price</TableHead>
                  <TableHead>Selling Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMedicines.map((medicine) => {
                  const stockStatus = getStockStatus(medicine);
                  const isExpiringSoon = expiringSoon.includes(medicine);
                  
                  return (
                    <TableRow key={medicine.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{medicine.name}</div>
                          <div className="text-sm text-muted-foreground">{medicine.manufacturer}</div>
                        </div>
                      </TableCell>
                      <TableCell>{medicine.category}</TableCell>
                      <TableCell>{medicine.batchNumber}</TableCell>
                      <TableCell className={isExpiringSoon ? "text-warning" : ""}>
                        {new Date(medicine.expiryDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>{medicine.currentStock}</span>
                          <Badge variant={stockStatus.variant} className="text-xs">
                            {stockStatus.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>${medicine.costPrice.toFixed(2)}</TableCell>
                      <TableCell>${medicine.sellingPrice.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={medicine.status === "active" ? "default" : "secondary"}>
                          {medicine.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(medicine)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openStockDialog(medicine)}
                          >
                            <Package className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Stock Update Dialog */}
      <Dialog open={isStockDialogOpen} onOpenChange={setIsStockDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Stock</DialogTitle>
            <DialogDescription>
              Update stock for {selectedMedicine?.name}
            </DialogDescription>
          </DialogHeader>
          <Form {...stockForm}>
            <form onSubmit={stockForm.handleSubmit(onStockUpdate)} className="space-y-4">
              <FormField
                control={stockForm.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transaction Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select transaction type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="purchase">Purchase (Add Stock)</SelectItem>
                        <SelectItem value="sale">Sale (Remove Stock)</SelectItem>
                        <SelectItem value="adjustment">Adjustment</SelectItem>
                        <SelectItem value="expired">Expired/Damaged</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={stockForm.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Enter quantity" 
                        {...field}
                        onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={stockForm.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Add any notes about this transaction" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Update Stock</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}