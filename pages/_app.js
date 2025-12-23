
import { AuthProvider } from "@/contexts/auth_context";
import '../styles/globals.css';
import '../styles/form.css';
import { ThemeProvider } from 'next-themes';
import "reactflow/dist/style.css";
import "@reactflow/node-resizer/dist/style.css";



export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
    <ThemeProvider attribute="class">
      <Component {...pageProps} />
    </ThemeProvider>
    </AuthProvider>
  );
}