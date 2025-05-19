import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { downloadCSV, formatDate, getLeadStatuses, getOccupationTypes } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { DatePicker } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { format } from "date-fns";
import { 
  Download, 
  FileText, 
  Loader2, 
  LogOut, 
  CalendarIcon, 
  RefreshCw, 
  Filter 
} from "lucide-react";

interface AuthStatus {
  authenticated: boolean;
  user?: {
    isAdmin?: boolean;
    // You can add other user fields here if needed
    [key: string]: any;
  };
}
interface Lead {
  id: number;
  fullName?: string;
  mobileNumber: string;
  occupationType: string;
  monthlySalary?: number;
  createdAt: string;
  status: string;
}


export default function Admin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [filters, setFilters] = useState({
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    occupationType: "" as string,
  });

  // Check if the user is authenticated
  const { data: authData, isLoading: authLoading } = useQuery<AuthStatus>({
    queryKey: ["/api/auth/status"],
  });

  // Fetch leads with filters
  const { 
    data: leads = [], 
    isLoading,
    refetch
  } = useQuery<Lead[]>({
    queryKey: [
      "/api/admin/leads/filter", 
      filters.startDate, 
      filters.endDate, 
      filters.occupationType
    ],
    enabled: !!authData?.authenticated && authData.user?.isAdmin,
  });
  
  // Update lead status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const response = await apiRequest("PATCH", `/api/admin/leads/${id}/status`, { status });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Status updated",
        description: "Lead status has been updated successfully",
      });
      // Invalidate the leads query to refetch
      queryClient.invalidateQueries({ queryKey: ["/api/admin/leads/filter"] });
    },
    onError: (error) => {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update lead status",
        variant: "destructive",
      });
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/logout", {});
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
      setLocation("/login");
    },
    onError: (error) => {
      toast({
        title: "Logout failed",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    },
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && (!authData?.authenticated || !authData.user?.isAdmin)) {
      toast({
        title: "Access denied",
        description: "You must be logged in as an admin to view this page",
        variant: "destructive",
      });
      setLocation("/login");
    }
  }, [authData, authLoading, setLocation, toast]);

  const handleStatusChange = (id: number, status: string) => {
    updateStatusMutation.mutate({ id, status });
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const handleExport = () => {
    const exportUrl = "/api/admin/leads/export";
    downloadCSV(exportUrl, "loan-leads.csv");
    
    toast({
      title: "Export started",
      description: "Your data is being downloaded as a CSV file",
    });
  };

  const resetFilters = () => {
    setFilters({
      startDate: undefined,
      endDate: undefined,
      occupationType: "",
    });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-background shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Loan Chaiye Admin</span>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
          >
            {logoutMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <LogOut className="h-4 w-4 mr-2" />
            )}
            Logout
          </Button>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#" >Admin Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Lead Management</CardTitle>
            <CardDescription>
              View and manage all loan application leads. Use the filters to narrow down results.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div className="flex flex-wrap gap-4">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="flex gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      {filters.startDate ? format(filters.startDate, "PP") : "Start Date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <DatePicker
                      mode="single"
                      selected={filters.startDate}
                      onSelect={(date) => {
                        if (date instanceof Date) {
                          setFilters({ ...filters, startDate: date });
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="flex gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      {filters.endDate ? format(filters.endDate, "PP") : "End Date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <DatePicker
                      mode="single"
                      selected={filters.endDate}
                      onSelect={(date) => {
                        if (date instanceof Date) {
                          setFilters({ ...filters, endDate: date });
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                
                <Select
                  value={filters.occupationType}
                  onValueChange={(value) => setFilters({ ...filters, occupationType: value })}
                >
                 <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Occupation Type" />
                  </SelectTrigger>
                 <SelectContent>
                 <SelectItem value="all">All Types</SelectItem>  {/* changed here */}
                   {getOccupationTypes().map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                     </SelectItem>
                   ))}
                 </SelectContent>
               </Select>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={resetFilters}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => refetch()}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
                
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={handleExport}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : leads.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Filter className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>No leads found. Try adjusting your filters or add new leads.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Full Name</TableHead>
                      <TableHead>Mobile</TableHead>
                      <TableHead>Occupation</TableHead>
                      <TableHead>Income</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leads.map((lead: any) => (
                      <TableRow key={lead.id}>
                        <TableCell className="font-medium">{lead.id}</TableCell>
                        <TableCell>{lead.fullName || "—"}</TableCell>
                        <TableCell>{lead.mobileNumber}</TableCell>
                        <TableCell>
                          {getOccupationTypes().find(type => type.value === lead.occupationType)?.label || lead.occupationType}
                        </TableCell>
                        <TableCell>{lead.monthlySalary ? `₹${lead.monthlySalary}` : "—"}</TableCell>
                        <TableCell>{formatDate(lead.createdAt)}</TableCell>
                        <TableCell>
                          <Select
                            defaultValue={lead.status}
                            onValueChange={(value) => handleStatusChange(lead.id, value)}
                          >
                            <SelectTrigger className="w-[130px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {getLeadStatuses().map((status) => (
                                <SelectItem key={status.value} value={status.value}>
                                  {status.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
