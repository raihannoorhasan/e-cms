"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { ArrowUpRight, Users, DollarSign, ShoppingCart, Store } from "lucide-react";

const salesData = [
  { name: "Jan", sales: 4000 },
  { name: "Feb", sales: 3000 },
  { name: "Mar", sales: 2000 },
  { name: "Apr", sales: 2780 },
  { name: "May", sales: 1890 },
  { name: "Jun", sales: 2390 },
];

const visitorData = [
  { name: "Mon", visitors: 2400 },
  { name: "Tue", visitors: 1398 },
  { name: "Wed", visitors: 9800 },
  { name: "Thu", visitors: 3908 },
  { name: "Fri", visitors: 4800 },
  { name: "Sat", visitors: 3800 },
  { name: "Sun", visitors: 4300 },
];

const CustomXAxis = (props) => <XAxis {...props} />;
const CustomYAxis = (props) => <YAxis {...props} />;

export default function DashboardPage() {
  return (
    <div className="p-6">
      <h1 className="mb-6 text-3xl font-bold">Dashboard Overview</h1>

      {/* Stats Grid */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="rounded-full bg-blue-100 p-3">
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Total Revenue</p>
              <h3 className="text-2xl font-bold">$54,239</h3>
              <p className="text-sm text-green-500">
                <ArrowUpRight className="inline h-4 w-4" /> +12.5%
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="rounded-full bg-purple-100 p-3">
              <Users className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Total Users</p>
              <h3 className="text-2xl font-bold">2,543</h3>
              <p className="text-sm text-green-500">
                <ArrowUpRight className="inline h-4 w-4" /> +8.2%
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="rounded-full bg-orange-100 p-3">
              <ShoppingCart className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Total Orders</p>
              <h3 className="text-2xl font-bold">1,789</h3>
              <p className="text-sm text-green-500">
                <ArrowUpRight className="inline h-4 w-4" /> +5.7%
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="rounded-full bg-green-100 p-3">
              <Store className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Active Vendors</p>
              <h3 className="text-2xl font-bold">432</h3>
              <p className="text-sm text-green-500">
                <ArrowUpRight className="inline h-4 w-4" /> +3.1%
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
            <CardDescription>Monthly sales performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <CustomXAxis dataKey="name" />
                  <CustomYAxis />
                  <Tooltip />
                  <Bar dataKey="sales" fill="hsl(var(--chart-1))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Visitor Analytics</CardTitle>
            <CardDescription>Weekly visitor statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={visitorData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <CustomXAxis dataKey="name" />
                  <CustomYAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="visitors"
                    stroke="hsl(var(--chart-2))"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}