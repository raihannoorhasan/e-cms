"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  Package,
  ShoppingBag,
  Clock,
  TrendingUp,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const purchaseHistory = [
  { month: "Jan", spent: 240 },
  { month: "Feb", spent: 300 },
  { month: "Mar", spent: 180 },
  { month: "Apr", spent: 420 },
  { month: "May", spent: 250 },
  { month: "Jun", spent: 380 },
];

const recentOrders = [
  {
    id: "ORD-001",
    date: "2024-03-20",
    items: 3,
    total: 149.99,
    status: "Delivered",
  },
  {
    id: "ORD-002",
    date: "2024-03-15",
    items: 2,
    total: 89.99,
    status: "Processing",
  },
  {
    id: "ORD-003",
    date: "2024-03-10",
    items: 1,
    total: 59.99,
    status: "Delivered",
  },
];

export default function CustomerDetailsPage() {
  const params = useParams();
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    // In a real app, fetch customer data based on params.id
    // For now, using mock data
    setCustomer({
      id: params?.id,
      name: "Sarah Johnson",
      email: "sarah.j@example.com",
      phone: "+1 (555) 123-4567",
      location: "New York, NY",
      joinDate: "2023-09-15",
      totalOrders: 24,
      totalSpent: 2890,
      lastOrder: "2024-03-20",
      status: "Active",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80",
      preferences: {
        categories: ["Electronics", "Fashion", "Home"],
        newsletter: true,
        paymentMethod: "Credit Card",
      },
      metrics: {
        averageOrderValue: 120.42,
        returnsRate: 2.1,
        loyaltyPoints: 450,
        lifetimeValue: 2890,
      },
    });
  }, [params?.id]);

  if (!customer) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Customer Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-24 h-24 rounded-full overflow-hidden">
            <img
              src={customer.avatar}
              alt={customer.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{customer.name}</h1>
            <div className="flex items-center space-x-4 mt-2">
              <Badge variant="secondary">{customer.status}</Badge>
              <span className="text-gray-500">
                Customer since{" "}
                {new Date(customer.joinDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center space-x-4 mt-2">
              <Mail className="h-4 w-4 text-gray-500" />
              <span>{customer.email}</span>
            </div>
          </div>
        </div>
        <Button>Contact Customer</Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="rounded-full bg-blue-100 p-3">
              <ShoppingBag className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Total Orders</p>
              <h3 className="text-2xl font-bold">{customer.totalOrders}</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="rounded-full bg-green-100 p-3">
              <CreditCard className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Total Spent</p>
              <h3 className="text-2xl font-bold">
                ${customer.totalSpent.toLocaleString()}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="rounded-full bg-purple-100 p-3">
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Avg. Order Value</p>
              <h3 className="text-2xl font-bold">
                ${customer.metrics.averageOrderValue.toFixed(2)}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="rounded-full bg-yellow-100 p-3">
              <Heart className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Loyalty Points</p>
              <h3 className="text-2xl font-bold">
                {customer.metrics.loyaltyPoints}
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
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
                  <Phone className="mr-2 h-4 w-4" />
                  {customer.phone}
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="mr-2 h-4 w-4" />
                  {customer.location}
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="mr-2 h-4 w-4" />
                  Last order: {new Date(customer.lastOrder).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Returns Rate</span>
                  <span className="font-semibold">
                    {customer.metrics.returnsRate}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Lifetime Value</span>
                  <span className="font-semibold">
                    ${customer.metrics.lifetimeValue}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Preferred Categories</span>
                  <div className="flex gap-2">
                    {customer.preferences.categories.map((category) => (
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
          <Card>
            <CardHeader>
              <CardTitle>Purchase History</CardTitle>
              <CardDescription>Monthly spending pattern</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={purchaseHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="spent"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}