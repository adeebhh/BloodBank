import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardPage from "./pages/DashboardPage";
import DonorsPage from "./pages/DonorsPage";
import BloodUnitsPage from "./pages/BloodUnitsPage";
import InventoryPage from "./pages/InventoryPage";
import BloodRequestsPage from "./pages/BloodRequestsPage";
import CampsPage from "./pages/CampsPage";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";
import LoginPage from "./pages/LoginPage";
function App() {
  return (
    <BrowserRouter><Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Routes>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/donors" element={<DonorsPage />} />
                  <Route path="/blood-units" element={<BloodUnitsPage />} />
                  <Route path="/inventory" element={<InventoryPage />} />
                  <Route path="/requests" element={<BloodRequestsPage />} />
                  <Route path="/camps" element={<CampsPage />} />
                  <Route path="/reports" element={<ReportsPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </MainLayout>
            </ProtectedRoute>}/>
      </Routes></BrowserRouter>
  );}
export default App;