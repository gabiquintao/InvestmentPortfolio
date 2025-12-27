// ============================================================================
// Layout Component
// Main application layout with header, sidebar, and content area
// ============================================================================

import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { LoadingSpinner } from "../common/LoadingSpinner";

// ============================================================================
// TYPES
// ============================================================================

interface LayoutProps {
  children: ReactNode;
}

// ============================================================================
// LAYOUT COMPONENT
// ============================================================================

export const Layout = ({ children }: LayoutProps) => {
  const { isAuthenticated, isLoading } = useAuthContext();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" text="Loading application..." />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <Header />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-6 max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
};

// ============================================================================
// PUBLIC LAYOUT (for login/register pages)
// ============================================================================

interface PublicLayoutProps {
  children: ReactNode;
}

export const PublicLayout = ({ children }: PublicLayoutProps) => {
  const { isAuthenticated } = useAuthContext();

  // Redirect to dashboard if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Investment Portfolio
          </h1>
          <p className="text-gray-600">Manage your investments effectively</p>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
          {children}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Investment Portfolio. All rights
          reserved.
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// EMPTY LAYOUT (for pages that don't need sidebar/header)
// ============================================================================

interface EmptyLayoutProps {
  children: ReactNode;
  requireAuth?: boolean;
}

export const EmptyLayout = ({
  children,
  requireAuth = false,
}: EmptyLayoutProps) => {
  const { isAuthenticated, isLoading } = useAuthContext();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <div className="min-h-screen bg-gray-50">{children}</div>;
};

export default Layout;
