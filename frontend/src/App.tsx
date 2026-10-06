import { Navigate, Route, Routes } from "react-router-dom";
import { RequireAuth, RequireRole } from "./auth/guards";
import { Layout } from "./components/Layout";
import { CategoriesPage } from "./pages/CategoriesPage";
import { DashboardPage } from "./pages/DashboardPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { RequestDetailPage } from "./pages/RequestDetailPage";
import { RequestFormPage } from "./pages/RequestFormPage";
import { RequestListPage } from "./pages/RequestListPage";
import { UsersPage } from "./pages/UsersPage";

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<RegisterPage />} />
      <Route element={<RequireAuth />}>
        <Route element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="solicitudes" element={<RequestListPage />} />
          <Route element={<RequireRole roles={["USER"]} />}>
            <Route path="solicitudes/nueva" element={<RequestFormPage />} />
          </Route>
          <Route path="solicitudes/:id" element={<RequestDetailPage />} />
          <Route element={<RequireRole roles={["ADMIN"]} />}>
            <Route path="usuarios" element={<UsersPage />} />
            <Route path="categorias" element={<CategoriesPage />} />
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
