"use client";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import SchemaBuilder from "@/components/SchemaBuilder";
import dynamic from "next/dynamic";
const ResumeBuildingApp = dynamic(() => import("@/components/Resume"), { ssr: false });

export default function Home() {
  return (
    <main className="flex min-h-screen">
      <ResumeBuildingApp />
    </main>
  );
}
