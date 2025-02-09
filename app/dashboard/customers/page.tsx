"use client";

import { useState } from "react";
import { Search, Filter, MoreVertical, Mail, Phone, MapPin, Calendar, Package, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const mockCustomers = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80",
    location: "New York, NY",
    phone: "+1 (555) 123-4567",
    totalOrders: 24,
    totalSpent: 2890,
    lastOrder: "2024-02-15",
    status: "Active",
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "m.chen@example.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80",
    location: "Los Angeles, CA",
    phone: "+1 (555) 987-6543",
    totalOrders: 18,
    totalSpent: 1950,
    lastOrder: "2024-02-10",
    status: "Active",
  },
  {
    id: 3,
    name: "Emma Wilson",
    email: "emma.w@example.com",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&q=80",
    location: "Chicago, IL",
    phone: "+1 (555) 456-7890",
    totalOrders: 12,
    totalSpent: 890,
    lastOrder: "2024-01-28",
    status: "Inactive",
  },
];

export default function CustomersPage() {
  const [customers] = useState(mockCustomers);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Customers</h1>
          <p className="text-gray-500">Manage your customer base</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input className="pl-9" placeholder="Search customers..." />
        </div>
        <div className="flex gap-2">
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" /> Filters
          </Button>
        </div>
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customers.map((customer) => (
          <Card key={customer.id} className="overflow-hidden">
            <CardHeader className="border-b pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={customer.avatar} alt={customer.name} />
                    <AvatarFallback>{customer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{customer.name}</CardTitle>
                    <Badge
                      variant={customer.status === "Active" ? "default" : "secondary"}
                    >
                      {customer.status}
                    </Badge>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    <DropdownMenuItem>Edit Customer</DropdownMenuItem>
                    <DropdownMenuItem>Order History</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-500">
                  <Mail className="mr-2 h-4 w-4" />
                  {customer.email}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Phone className="mr-2 h-4 w-4" />
                  {customer.phone}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="mr-2 h-4 w-4" />
                  {customer.location}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 border-t pt-4">
                <div>
                  <div className="flex items-center text-sm text-gray-500 mb-1">
                    <Package className="mr-2 h-4 w-4" />
                    Total Orders
                  </div>
                  <p className="text-lg font-semibold">{customer.totalOrders}</p>
                </div>
                <div>
                  <div className="flex items-center text-sm text-gray-500 mb-1">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Total Spent
                  </div>
                  <p className="text-lg font-semibold">${customer.totalSpent}</p>
                </div>
              </div>
              <div className="border-t pt-4">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="mr-2 h-4 w-4" />
                  Last Order: {new Date(customer.lastOrder).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}