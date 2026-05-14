import { Outlet, Navigate } from "react-router-dom";
import { Suspense } from "react";
import { useSelector } from "react-redux";
import { Navigation } from "../components/common/NavigationBar";
import { Footer } from "../components/common/Footer/Footer";
import type { RootState } from "../redux/store";

export const AppLayout = () => {
  const { token } = useSelector((state: RootState) => state.auth);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-layout" style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navigation />

      <main className="app-content" style={{ flex: 1 }}>
        <Suspense fallback={<div>Loading...</div>}>
          <Outlet />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
};
