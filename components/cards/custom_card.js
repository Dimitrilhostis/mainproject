"use client";

import React from "react";
import { cn } from "@/lib/utils";

export default function CustomCard({ className, children }) {
  return (
    <div className={cn("rounded-2xl shadow-lg p-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-white", className)}>
          {children}
        </div>
  );
}
