"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { TrendingUp, Users, ShoppingBag, DollarSign, ArrowUpRight, ArrowDownRight } from "lucide-react";

const salesData = [
  { month: "Jan", revenue: 45000, orders: 670 },
  { month: "Feb", revenue: 52000, orders: 780 },
  { month: "Mar", revenue: 48000, orders: 720 },
  { month: "Apr", revenue: 61000, orders: 890 },
  { month: "May", revenue: 55000, orders: 810 },
  { month: "Jun", revenue: 67000, orders: 950 },
];

const categoryData = [
  { name: "Electronics", value: 35 },
  { name: "Fashion", value: 25 },
  { name: "Home & Garden", value: 20 },
  { name: "Sports", value: 15 },
  { name: "Books", value: 5 },
];

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

export default function AnalyticsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-gray-500">Monitor your business performance</p>
        </div>
        <Select defaultValue="7d">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="12m">Last 12 months</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="rounded-full bg-blue-100 p-3">
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Total Revenue</p>
              <h3 className="text-2xl font-bold">$328,000</h3>
              <p className="text-sm text-green-500">
                <ArrowUpRight className="inline h-4 w-4" /> +12.5%
              </p>
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
              <h3 className="text-2xl font-bold">4,820</h3>
              <p className="text-sm text-green-500">
                <ArrowUpRight className="inline h-4 w-4" /> +8.2%
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="rounded-full bg-orange-100 p-3">
              <Users className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">New Customers</p>
              <h3 className="text-2xl font-bold">642</h3>
              <p className="text-sm text-red-500">
                <ArrowDownRight className="inline h-4 w-4" /> -3.1%
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
             <div className="rounded-full bg-green-100 p-3">
      <TrendingUp className="h-8 w-8 text-green-600" />
    </div>
           
            <div className="ml-4">
              <p className="text-sm text-gray-500">Conversion Rate</p>
              <h3 className="text-2xl font-bold">3.42%</h3>
              <p className="text-sm text-green-500">
                <ArrowUpRight className="inline h-4 w-4" /> +2.4%
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue & Orders</CardTitle>
            <CardDescription>Monthly revenue and order trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={2}
                    name="Revenue ($)"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="orders"
                    stroke="hsl(var(--chart-2))"
                    strokeWidth={2}
                    name="Orders"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
            <CardDescription>Distribution of sales across categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Monthly Performance</CardTitle>
            <CardDescription>Detailed monthly sales performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="revenue" name="Revenue ($)" fill="hsl(var(--chart-1))" />
                  <Bar dataKey="orders" name="Orders" fill="hsl(var(--chart-2))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}