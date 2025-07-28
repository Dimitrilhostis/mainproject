"use client";

import React from "react";
import { cn } from "@/lib/utils";

export default function CustomCard({ className, children }) {
  return (
    <div className="bg-[var(--light-dark)] rounded-xl shadow-md transform transition-shadow transition-transform duration-200 hover:shadow-lg hover:ring-2 hover:ring-[var(--green3)] hover:-translate-y-1">
      {children}
    </div>
  );
}
