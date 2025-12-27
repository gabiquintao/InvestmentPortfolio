// ============================================================================
// LoginPage Component
// User login page with email and password
// ============================================================================

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuthContext } from "../../context/AuthContext";
import { PublicLayout } from "../../components/layout/Layout";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import { ErrorMessage } from "../../components/common/ErrorMessage";
import {
  isValidEmail,
  getEmailError,
  getRequiredFieldError,
} from "../../utils/validators";

// ============================================================================
// LOGIN PAGE COMPONENT
// ============================================================================

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, error, clearError, isLoading } = useAuthContext();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear field error on change
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // Clear global error
    if (error) {
      clearError();
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const errors = {
      email: "",
      password: "",
    };

    // Validate email
    const emailError = getEmailError(formData.email);
    if (emailError) {
      errors.email = emailError;
    }

    // Validate password
    const passwordError = getRequiredFieldError(formData.password, "Password");
    if (passwordError) {
      errors.password = passwordError;
    }

    setFormErrors(errors);
    return !errors.email && !errors.password;
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const success = await login({
      email: formData.email,
      password: formData.password,
    });

    if (success) {
      navigate("/dashboard");
    }
  };

  return (
    <PublicLayout>
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back</h2>
        <p className="text-gray-600 mb-6">
          Sign in to your account to continue
        </p>

        {/* Global Error Message */}
        {error && (
          <div className="mb-6">
            <ErrorMessage message={error} onClose={clearError} />
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <Input
            type="email"
            name="email"
            label="Email address"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            error={formErrors.email}
            leftIcon={<Mail className="h-5 w-5" />}
            autoComplete="email"
            disabled={isLoading}
          />

          {/* Password Field */}
          <div>
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              label="Password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              error={formErrors.password}
              leftIcon={<Lock className="h-5 w-5" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              }
              autoComplete="current-password"
              disabled={isLoading}
            />
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Remember me</span>
            </label>

            <Link
              to="/forgot-password"
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isLoading}
            disabled={isLoading}
          >
            Sign in
          </Button>
        </form>

        {/* Sign Up Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-blue-600 hover:text-blue-700"
            >
              Sign up
            </Link>
          </p>
        </div>

        {/* Demo Credentials (optional - remove in production) */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-800 font-semibold mb-2">
            Demo Credentials:
          </p>
          <p className="text-xs text-blue-700">
            Email: demo@example.com
            <br />
            Password: Demo123!
          </p>
        </div>
      </div>
    </PublicLayout>
  );
};

export default LoginPage;
