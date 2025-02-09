"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Globe, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Props {
  onSave: (vendor: any) => void;
  onCancel: () => void;
}

export default function VendorForm({ onSave, onCancel }: Props) {
  const [vendor, setVendor] = useState({
    name: "",
    email: "",
    phone: "",
    website: "",
    description: "",
    logo: "",
    status: "pending",
    company: {
      name: "",
      registration_number: "",
      tax_id: "",
      address: {
        street: "",
        city: "",
        state: "",
        postal_code: "",
        country: "",
      },
    },
    categories: [] as string[],
    payment: {
      bank_name: "",
      account_holder: "",
      account_number: "",
      routing_number: "",
    },
  });

  const handleSubmit = () => {
    if (
      vendor.name &&
      vendor.email &&
      vendor.phone &&
      vendor.company.name
    ) {
      onSave(vendor);
    }
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            Enter the vendor's basic contact information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Vendor Name</Label>
              <Input
                id="name"
                value={vendor.name}
                onChange={(e) =>
                  setVendor({ ...vendor, name: e.target.value })
                }
                placeholder="Enter vendor name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="logo">Logo URL</Label>
              <Input
                id="logo"
                value={vendor.logo}
                onChange={(e) =>
                  setVendor({ ...vendor, logo: e.target.value })
                }
                placeholder="Enter logo URL"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input
                  id="email"
                  className="pl-9"
                  value={vendor.email}
                  onChange={(e) =>
                    setVendor({ ...vendor, email: e.target.value })
                  }
                  placeholder="vendor@example.com"
                  type="email"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input
                  id="phone"
                  className="pl-9"
                  value={vendor.phone}
                  onChange={(e) =>
                    setVendor({ ...vendor, phone: e.target.value })
                  }
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input
                  id="website"
                  className="pl-9"
                  value={vendor.website}
                  onChange={(e) =>
                    setVendor({ ...vendor, website: e.target.value })
                  }
                  placeholder="https://example.com"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={vendor.status}
                onValueChange={(value) =>
                  setVendor({ ...vendor, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={vendor.description}
              onChange={(e) =>
                setVendor({ ...vendor, description: e.target.value })
              }
              placeholder="Enter vendor description"
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Company Information */}
      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
          <CardDescription>
            Enter the vendor's company details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <div className="relative">
                <Building className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input
                  id="companyName"
                  className="pl-9"
                  value={vendor.company.name}
                  onChange={(e) =>
                    setVendor({
                      ...vendor,
                      company: {
                        ...vendor.company,
                        name: e.target.value,
                      },
                    })
                  }
                  placeholder="Enter company name"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="registrationNumber">Registration Number</Label>
              <Input
                id="registrationNumber"
                value={vendor.company.registration_number}
                onChange={(e) =>
                  setVendor({
                    ...vendor,
                    company: {
                      ...vendor.company,
                      registration_number: e.target.value,
                    },
                  })
                }
                placeholder="Enter registration number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxId">Tax ID</Label>
              <Input
                id="taxId"
                value={vendor.company.tax_id}
                onChange={(e) =>
                  setVendor({
                    ...vendor,
                    company: {
                      ...vendor.company,
                      tax_id: e.target.value,
                    },
                  })
                }
                placeholder="Enter tax ID"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Company Address</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Input
                  value={vendor.company.address.street}
                  onChange={(e) =>
                    setVendor({
                      ...vendor,
                      company: {
                        ...vendor.company,
                        address: {
                          ...vendor.company.address,
                          street: e.target.value,
                        },
                      },
                    })
                  }
                  placeholder="Street address"
                />
              </div>
              <Input
                value={vendor.company.address.city}
                onChange={(e) =>
                  setVendor({
                    ...vendor,
                    company: {
                      ...vendor.company,
                      address: {
                        ...vendor.company.address,
                        city: e.target.value,
                      },
                    },
                  })
                }
                placeholder="City"
              />
              <Input
                value={vendor.company.address.state}
                onChange={(e) =>
                  setVendor({
                    ...vendor,
                    company: {
                      ...vendor.company,
                      address: {
                        ...vendor.company.address,
                        state: e.target.value,
                      },
                    },
                  })
                }
                placeholder="State"
              />
              <Input
                value={vendor.company.address.postal_code}
                onChange={(e) =>
                  setVendor({
                    ...vendor,
                    company: {
                      ...vendor.company,
                      address: {
                        ...vendor.company.address,
                        postal_code: e.target.value,
                      },
                    },
                  })
                }
                placeholder="Postal code"
              />
              <Input
                value={vendor.company.address.country}
                onChange={(e) =>
                  setVendor({
                    ...vendor,
                    company: {
                      ...vendor.company,
                      address: {
                        ...vendor.company.address,
                        country: e.target.value,
                      },
                    },
                  })
                }
                placeholder="Country"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Information */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Information</CardTitle>
          <CardDescription>
            Enter the vendor's payment details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bankName">Bank Name</Label>
              <Input
                id="bankName"
                value={vendor.payment.bank_name}
                onChange={(e) =>
                  setVendor({
                    ...vendor,
                    payment: {
                      ...vendor.payment,
                      bank_name: e.target.value,
                    },
                  })
                }
                placeholder="Enter bank name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="accountHolder">Account Holder</Label>
              <Input
                id="accountHolder"
                value={vendor.payment.account_holder}
                onChange={(e) =>
                  setVendor({
                    ...vendor,
                    payment: {
                      ...vendor.payment,
                      account_holder: e.target.value,
                    },
                  })
                }
                placeholder="Enter account holder name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                value={vendor.payment.account_number}
                onChange={(e) =>
                  setVendor({
                    ...vendor,
                    payment: {
                      ...vendor.payment,
                      account_number: e.target.value,
                    },
                  })
                 }
                }
                placeholder="Enter account number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="routingNumber">Routing Number</Label>
              <Input
                id="routingNumber"
                value={vendor.payment.routing_number}
                onChange={(e) =>
                  setVendor({
                    ...vendor,
                    payment: {
                      ...vendor.payment,
                      routing_number: e.target.value,
                    },
                  })
                }
                placeholder="Enter routing number"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>Save Vendor</Button>
      </div>
    </div>
  );
}