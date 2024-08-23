"use client";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import SchemaBuilder from "@/components/SchemaBuilder";

export default function Home() {
  return (
    <main className="flex min-h-screen">
      <SchemaBuilder />
    </main>
  );
}
