"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Customer = {
  id: string;
  name: string;
  email: string;
};

type CustomerSelectProps = {
  customers: Customer[];
  name?: string;
};

export const CustomerSelect = ({
  customers,
  name = "customer_id",
}: CustomerSelectProps) => {
  const [value, setValue] = useState<string>("");

  return (
    <div>
      <input type="hidden" name={name} value={value} />
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger>
          <SelectValue placeholder="Select customer" />
        </SelectTrigger>
        <SelectContent>
          {customers.map((customer) => (
            <SelectItem key={customer.id} value={customer.id}>
              {customer.name} · {customer.email}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
