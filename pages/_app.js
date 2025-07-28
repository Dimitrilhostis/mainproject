
import { AuthProvider } from "@/contexts/auth_context";
import '../styles/globals.css';
import { ThemeProvider } from 'next-themes';

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
    <ThemeProvider attribute="class">
      <Component {...pageProps} />
    </ThemeProvider>
    </AuthProvider>
  );
}