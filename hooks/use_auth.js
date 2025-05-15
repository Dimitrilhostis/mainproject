// hooks/useAuth.js
import { useContext } from "react";
import { AuthContext } from "@/contexts/auth_context";

export default function useAuth() {
  return useContext(AuthContext);
}
