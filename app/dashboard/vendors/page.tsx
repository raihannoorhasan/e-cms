"use client";

import { useState } from "react";
import { Plus, Search, MapPin, Mail, Phone, Star, Shield, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const mockVendors = [
  {
    id: 1,
    name: "TechPro Solutions",
    logo: "https://images.unsplash.com/photo-1568952433726-3896e3881c65?w=300&q=80",
    location: "San Francisco, CA",
    email: "contact@techpro.com",
    phone: "+1 (555) 123-4567",
    rating: 4.8,
    status: "Verified",
    products: 245,
    revenue: 125000,
    joinDate: "2023-01-15",
  },
  {
    id: 2,
    name: "EcoWear Fashion",
    logo: "https://images.unsplash.com/photo-1560072810-1cffb09faf0f?w=300&q=80",
    location: "Portland, OR",
    email: "support@ecowear.com",
    phone: "+1 (555) 987-6543",
    rating: 4.5,
    status: "Verified",
    products: 189,
    revenue: 89000,
    joinDate: "2023-03-22",
  },
  {
    id: 3,
    name: "SmartTech Gadgets",
    logo: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=300&q=80",
    location: "Austin, TX",
    email: "info@smarttech.com",
    phone: "+1 (555) 456-7890",
    rating: 4.2,
    status: "Pending",
    products: 78,
    revenue: 45000,
    joinDate: "2023-06-10",
  },
];

export default function VendorsPage() {
  const [vendors] = useState(mockVendors);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Vendors</h1>
          <p className="text-gray-500">Manage your marketplace vendors</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Vendor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Vendor</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="vendorName">Vendor Name</Label>
                <Input id="vendorName" placeholder="Enter vendor name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="vendor@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" placeholder="Enter phone number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="City, State" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="logo">Logo URL</Label>
                <Input id="logo" placeholder="Enter logo URL" />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline">Cancel</Button>
              <Button>Save Vendor</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input className="pl-9" placeholder="Search vendors..." />
        </div>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="verified">Verified</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Vendors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vendors.map((vendor) => (
          <Card key={vendor.id} className="overflow-hidden">
            <CardHeader className="border-b pb-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full overflow-hidden">
                  <img
                    src={vendor.logo}
                    alt={vendor.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <CardTitle className="flex items-center">
                    {vendor.name}
                    {vendor.status === "Verified" && (
                      <Shield className="ml-2 h-4 w-4 text-blue-500" />
                    )}
                  </CardTitle>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="mr-1 h-4 w-4" />
                    {vendor.location}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center text-gray-500">
                    <Mail className="mr-2 h-4 w-4" />
                    {vendor.email}
                  </div>
                  <div className="flex items-center text-gray-500">
                    <Phone className="mr-2 h-4 w-4" />
                    {vendor.phone}
                  </div>
                </div>
                <div className="space-y-2 text-right">
                  <div className="flex items-center justify-end text-gray-500">
                    <Star className="mr-1 h-4 w-4 text-yellow-400" />
                    {vendor.rating}
                  </div>
                  <Badge
                    variant={vendor.status === "Verified" ? "default" : "secondary"}
                  >
                    {vendor.status}
                  </Badge>
                </div>
              </div>
              <div className="border-t pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Products</p>
                    <p className="text-lg font-semibold">{vendor.products}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Revenue</p>
                    <p className="text-lg font-semibold">
                      ${vendor.revenue.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                <ExternalLink className="mr-2 h-4 w-4" /> View Profile
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}