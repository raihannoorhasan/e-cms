"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Building,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Package,
  DollarSign,
  Star,
  TrendingUp,
  Users,
  ShoppingBag,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

const salesData = [
  { month: "Jan", sales: 4000 },
  { month: "Feb", sales: 3000 },
  { month: "Mar", sales: 2000 },
  { month: "Apr", sales: 2780 },
  { month: "May", sales: 1890 },
  { month: "Jun", sales: 2390 },
];

const productPerformance = [
  { name: "Product A", sales: 400, revenue: 2400 },
  { name: "Product B", sales: 300, revenue: 1398 },
  { name: "Product C", sales: 200, revenue: 9800 },
  { name: "Product D", sales: 278, revenue: 3908 },
  { name: "Product E", sales: 189, revenue: 4800 },
];

export default function VendorDetailsPage() {
  const params = useParams();
  const [vendor, setVendor] = useState(null);

  useEffect(() => {
    // In a real app, fetch vendor data based on params.id
    // For now, using mock data
    setVendor({
      id: params.id,
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
      description: "Leading provider of innovative tech solutions and gadgets.",
      categories: ["Electronics", "Gadgets", "Accessories"],
      metrics: {
        totalOrders: 1250,
        averageOrderValue: 180,
        returnRate: 2.3,
        customerSatisfaction: 4.7,
      },
    });
  }, [params.id]);

  if (!vendor) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Vendor Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-24 h-24 rounded-lg overflow-hidden">
            <img
              src={vendor.logo}
              alt={vendor.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-3xl font-bold">{vendor.name}</h1>
              {vendor.status === "Verified" && (
                <Shield className="h-6 w-6 text-blue-500" />
              )}
            </div>
            <div className="flex items-center space-x-4 mt-2">
              <Badge variant="secondary">{vendor.status}</Badge>
              <div className="flex items-center text-yellow-500">
                <Star className="h-4 w-4 fill-current" />
                <span className="ml-1">{vendor.rating}</span>
              </div>
              <span className="text-gray-500">
                Member since {new Date(vendor.joinDate).toLocaleDateString()}
              </span>
            </div>
            <p className="mt-2 text-gray-600">{vendor.description}</p>
          </div>
        </div>
        <Button>Contact Vendor</Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="rounded-full bg-blue-100 p-3">
              <Package className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Total Products</p>
              <h3 className="text-2xl font-bold">{vendor.products}</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="rounded-full bg-green-100 p-3">
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Total Revenue</p>
              <h3 className="text-2xl font-bold">
                ${vendor.revenue.toLocaleString()}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="rounded-full bg-purple-100 p-3">
              <ShoppingBag className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Total Orders</p>
              <h3 className="text-2xl font-bold">
                {vendor.metrics.totalOrders.toLocaleString()}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="rounded-full bg-orange-100 p-3">
              <Users className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Customer Satisfaction</p>
              <h3 className="text-2xl font-bold">
                {vendor.metrics.customerSatisfaction}/5
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center text-gray-600">
                  <Mail className="mr-2 h-4 w-4" />
                  {vendor.email}
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="mr-2 h-4 w-4" />
                  {vendor.phone}
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="mr-2 h-4 w-4" />
                  {vendor.location}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Average Order Value</span>
                  <span className="font-semibold">
                    ${vendor.metrics.averageOrderValue}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Return Rate</span>
                  <span className="font-semibold">
                    {vendor.metrics.returnRate}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Categories</span>
                  <div className="flex gap-2">
                    {vendor.categories.map((category) => (
                      <Badge key={category} variant="secondary">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Sales Trend</CardTitle>
                <CardDescription>Monthly sales performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="sales"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Product Performance</CardTitle>
                <CardDescription>Top performing products</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={productPerformance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="sales" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}