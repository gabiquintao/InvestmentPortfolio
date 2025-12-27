// ============================================================================
// RegisterPage Component
// User registration page with validation and password strength indicator
// ============================================================================

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { useAuthContext } from "../../context/AuthContext";
import { PublicLayout } from "../../components/layout/Layout";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import { ErrorMessage } from "../../components/common/ErrorMessage";
import {
  getEmailError,
  getPasswordError,
  getPasswordConfirmError,
  getFullNameError,
  getPasswordStrength,
} from "../../utils/validators";

// ============================================================================
// REGISTER PAGE COMPONENT
// ============================================================================

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, error, clearError, isLoading } = useAuthContext();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [formErrors, setFormErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Calculate password strength
  const passwordStrength = formData.password
    ? getPasswordStrength(formData.password)
    : null;

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
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    };

    // Validate full name
    const fullNameError = getFullNameError(formData.fullName);
    if (fullNameError) {
      errors.fullName = fullNameError;
    }

    // Validate email
    const emailError = getEmailError(formData.email);
    if (emailError) {
      errors.email = emailError;
    }

    // Validate password
    const passwordError = getPasswordError(formData.password);
    if (passwordError) {
      errors.password = passwordError;
    }

    // Validate password confirmation
    const confirmError = getPasswordConfirmError(
      formData.password,
      formData.confirmPassword
    );
    if (confirmError) {
      errors.confirmPassword = confirmError;
    }

    setFormErrors(errors);
    return (
      !errors.fullName &&
      !errors.email &&
      !errors.password &&
      !errors.confirmPassword
    );
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!acceptTerms) {
      alert("Please accept the terms and conditions to continue.");
      return;
    }

    if (!validateForm()) {
      return;
    }

    const success = await register({
      fullName: formData.fullName,
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
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Create an account
        </h2>
        <p className="text-gray-600 mb-6">
          Start managing your investments today
        </p>

        {/* Global Error Message */}
        {error && (
          <div className="mb-6">
            <ErrorMessage message={error} onClose={clearError} />
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name Field */}
          <Input
            type="text"
            name="fullName"
            label="Full name"
            placeholder="John Doe"
            value={formData.fullName}
            onChange={handleChange}
            error={formErrors.fullName}
            leftIcon={<User className="h-5 w-5" />}
            autoComplete="name"
            disabled={isLoading}
          />

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
              placeholder="Create a strong password"
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
              autoComplete="new-password"
              disabled={isLoading}
            />

            {/* Password Strength Indicator */}
            {passwordStrength && formData.password && (
              <div className="mt-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                      style={{
                        width: `${(passwordStrength.score / 4) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-600">
                    {passwordStrength.label}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  Use 8+ characters with uppercase, lowercase, and numbers
                </p>
              </div>
            )}
          </div>

          {/* Confirm Password Field */}
          <Input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            label="Confirm password"
            placeholder="Re-enter your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={formErrors.confirmPassword}
            leftIcon={<Lock className="h-5 w-5" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="cursor-pointer"
                tabIndex={-1}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            }
            autoComplete="new-password"
            disabled={isLoading}
          />

          {/* Terms and Conditions */}
          <div className="flex items-start">
            <input
              type="checkbox"
              id="terms"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="h-4 w-4 mt-0.5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="terms" className="ml-2 text-sm text-gray-700">
              I agree to the{" "}
              <Link
                to="/terms"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Terms and Conditions
              </Link>{" "}
              and{" "}
              <Link
                to="/privacy"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Privacy Policy
              </Link>
            </label>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isLoading}
            disabled={isLoading || !acceptTerms}
          >
            Create account
          </Button>
        </form>

        {/* Sign In Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-700"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </PublicLayout>
  );
};

export default RegisterPage;
