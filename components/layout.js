// components/layout.jsx
"use client";


import useAutoLogout from "@/hooks/use_auth_logout";

export default function Layout({ children }) {
  useAutoLogout(15 * 60 * 1000); // 15 min
  return <>{children}</>;
}
