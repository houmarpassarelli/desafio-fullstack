import { BrowserRouter } from "react-router-dom";
import { Router } from "./Router";
import { AuthProvider } from "./hooks/useAuth";

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Router />
      </AuthProvider>
    </BrowserRouter>
  )
}

