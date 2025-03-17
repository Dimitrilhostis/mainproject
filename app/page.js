"use client"; // Important pour activer le mode Client

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/entry_page");
  }, [router]);

  return null;
}
