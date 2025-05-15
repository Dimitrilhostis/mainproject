// pages/_app.jsx
import { AuthProvider } from "@/contexts/auth_context";
import "../styles/globals.css";

export default function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
