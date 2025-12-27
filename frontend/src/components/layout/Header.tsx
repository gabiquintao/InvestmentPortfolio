// ============================================================================
// Header Component
// Top navigation bar with user info, notifications, and actions
// ============================================================================

import { useState } from "react";
import { Bell, User, LogOut, Settings, ChevronDown } from "lucide-react";
import { useAuthContext } from "../../context/AuthContext";
import { useAlerts } from "../../hooks/useAlerts";
import { useNavigate } from "react-router-dom";

// ============================================================================
// HEADER COMPONENT
// ============================================================================

export const Header = () => {
  const { user, logout } = useAuthContext();
  const { activeAlerts } = useAlerts(true);
  const navigate = useNavigate();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const activeAlertsCount = activeAlerts.filter(
    (a) => a.triggeredAt !== null
  ).length;

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left Section - Logo/Title */}
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-gray-900">
            Investment Portfolio
          </h1>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              {activeAlertsCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-xs text-white">
                  {activeAlertsCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowNotifications(false)}
                />
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900">
                      Notifications
                    </h3>
                  </div>

                  <div className="max-h-96 overflow-y-auto">
                    {activeAlertsCount > 0 ? (
                      <div className="divide-y divide-gray-200">
                        {activeAlerts
                          .filter((a) => a.triggeredAt !== null)
                          .slice(0, 5)
                          .map((alert) => (
                            <div
                              key={alert.alertId}
                              className="p-4 hover:bg-gray-50"
                            >
                              <div className="flex items-start gap-3">
                                <div className="shrink-0 w-2 h-2 mt-2 rounded-full bg-red-600" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900">
                                    Alert Triggered: {alert.assetSymbol}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {alert.conditionName} €{alert.targetPrice}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="p-8 text-center text-gray-500">
                        <Bell className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm">No new notifications</p>
                      </div>
                    )}
                  </div>

                  {activeAlertsCount > 0 && (
                    <div className="p-3 border-t border-gray-200">
                      <button
                        onClick={() => {
                          navigate("/alerts");
                          setShowNotifications(false);
                        }}
                        className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        View all alerts
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full">
                <User className="h-4 w-4" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900">
                  {user?.fullName}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </button>

            {/* User Dropdown Menu */}
            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                  <div className="p-3 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.fullName}
                    </p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>

                  <div className="py-2">
                    <button
                      onClick={() => {
                        navigate("/profile");
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <User className="h-4 w-4" />
                      Profile
                    </button>

                    <button
                      onClick={() => {
                        navigate("/settings");
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </button>
                  </div>

                  <div className="border-t border-gray-200 py-2">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
