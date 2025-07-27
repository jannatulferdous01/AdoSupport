"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function SearchBar() {
  const [search, setSearch] = useState("");

  return (
    <div className="relative w-64">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <Input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="h-9 pl-9 pr-4 text-sm"
      />
    </div>
  );
}