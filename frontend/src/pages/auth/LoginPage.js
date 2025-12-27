import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
import { isValidEmail, getEmailError, getRequiredFieldError, } from "../../utils/validators";
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
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear field error on change
        if (formErrors[name]) {
            setFormErrors((prev) => ({ ...prev, [name]: "" }));
        }
        // Clear global error
        if (error) {
            clearError();
        }
    };
    // Validate form
    const validateForm = () => {
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
    const handleSubmit = async (e) => {
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
    return (_jsx(PublicLayout, { children: _jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-2", children: "Welcome back" }), _jsx("p", { className: "text-gray-600 mb-6", children: "Sign in to your account to continue" }), error && (_jsx("div", { className: "mb-6", children: _jsx(ErrorMessage, { message: error, onClose: clearError }) })), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-5", children: [_jsx(Input, { type: "email", name: "email", label: "Email address", placeholder: "you@example.com", value: formData.email, onChange: handleChange, error: formErrors.email, leftIcon: _jsx(Mail, { className: "h-5 w-5" }), autoComplete: "email", disabled: isLoading }), _jsx("div", { children: _jsx(Input, { type: showPassword ? "text" : "password", name: "password", label: "Password", placeholder: "Enter your password", value: formData.password, onChange: handleChange, error: formErrors.password, leftIcon: _jsx(Lock, { className: "h-5 w-5" }), rightIcon: _jsx("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "cursor-pointer", tabIndex: -1, children: showPassword ? (_jsx(EyeOff, { className: "h-5 w-5" })) : (_jsx(Eye, { className: "h-5 w-5" })) }), autoComplete: "current-password", disabled: isLoading }) }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("label", { className: "flex items-center", children: [_jsx("input", { type: "checkbox", className: "h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" }), _jsx("span", { className: "ml-2 text-sm text-gray-700", children: "Remember me" })] }), _jsx(Link, { to: "/forgot-password", className: "text-sm font-medium text-blue-600 hover:text-blue-700", children: "Forgot password?" })] }), _jsx(Button, { type: "submit", variant: "primary", fullWidth: true, isLoading: isLoading, disabled: isLoading, children: "Sign in" })] }), _jsx("div", { className: "mt-6 text-center", children: _jsxs("p", { className: "text-sm text-gray-600", children: ["Don't have an account?", " ", _jsx(Link, { to: "/register", className: "font-medium text-blue-600 hover:text-blue-700", children: "Sign up" })] }) }), _jsxs("div", { className: "mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg", children: [_jsx("p", { className: "text-xs text-blue-800 font-semibold mb-2", children: "Demo Credentials:" }), _jsxs("p", { className: "text-xs text-blue-700", children: ["Email: demo@example.com", _jsx("br", {}), "Password: Demo123!"] })] })] }) }));
};
export default LoginPage;
