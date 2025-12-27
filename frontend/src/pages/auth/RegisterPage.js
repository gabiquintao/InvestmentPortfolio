import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
import { getEmailError, getPasswordError, getPasswordConfirmError, getFullNameError, getPasswordStrength, } from "../../utils/validators";
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
        const confirmError = getPasswordConfirmError(formData.password, formData.confirmPassword);
        if (confirmError) {
            errors.confirmPassword = confirmError;
        }
        setFormErrors(errors);
        return (!errors.fullName &&
            !errors.email &&
            !errors.password &&
            !errors.confirmPassword);
    };
    // Handle form submit
    const handleSubmit = async (e) => {
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
    return (_jsx(PublicLayout, { children: _jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-2", children: "Create an account" }), _jsx("p", { className: "text-gray-600 mb-6", children: "Start managing your investments today" }), error && (_jsx("div", { className: "mb-6", children: _jsx(ErrorMessage, { message: error, onClose: clearError }) })), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-5", children: [_jsx(Input, { type: "text", name: "fullName", label: "Full name", placeholder: "John Doe", value: formData.fullName, onChange: handleChange, error: formErrors.fullName, leftIcon: _jsx(User, { className: "h-5 w-5" }), autoComplete: "name", disabled: isLoading }), _jsx(Input, { type: "email", name: "email", label: "Email address", placeholder: "you@example.com", value: formData.email, onChange: handleChange, error: formErrors.email, leftIcon: _jsx(Mail, { className: "h-5 w-5" }), autoComplete: "email", disabled: isLoading }), _jsxs("div", { children: [_jsx(Input, { type: showPassword ? "text" : "password", name: "password", label: "Password", placeholder: "Create a strong password", value: formData.password, onChange: handleChange, error: formErrors.password, leftIcon: _jsx(Lock, { className: "h-5 w-5" }), rightIcon: _jsx("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "cursor-pointer", tabIndex: -1, children: showPassword ? (_jsx(EyeOff, { className: "h-5 w-5" })) : (_jsx(Eye, { className: "h-5 w-5" })) }), autoComplete: "new-password", disabled: isLoading }), passwordStrength && formData.password && (_jsxs("div", { className: "mt-2", children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx("div", { className: "flex-1 h-2 bg-gray-200 rounded-full overflow-hidden", children: _jsx("div", { className: `h-full transition-all duration-300 ${passwordStrength.color}`, style: {
                                                            width: `${(passwordStrength.score / 4) * 100}%`,
                                                        } }) }), _jsx("span", { className: "text-xs font-medium text-gray-600", children: passwordStrength.label })] }), _jsx("p", { className: "text-xs text-gray-500", children: "Use 8+ characters with uppercase, lowercase, and numbers" })] }))] }), _jsx(Input, { type: showConfirmPassword ? "text" : "password", name: "confirmPassword", label: "Confirm password", placeholder: "Re-enter your password", value: formData.confirmPassword, onChange: handleChange, error: formErrors.confirmPassword, leftIcon: _jsx(Lock, { className: "h-5 w-5" }), rightIcon: _jsx("button", { type: "button", onClick: () => setShowConfirmPassword(!showConfirmPassword), className: "cursor-pointer", tabIndex: -1, children: showConfirmPassword ? (_jsx(EyeOff, { className: "h-5 w-5" })) : (_jsx(Eye, { className: "h-5 w-5" })) }), autoComplete: "new-password", disabled: isLoading }), _jsxs("div", { className: "flex items-start", children: [_jsx("input", { type: "checkbox", id: "terms", checked: acceptTerms, onChange: (e) => setAcceptTerms(e.target.checked), className: "h-4 w-4 mt-0.5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" }), _jsxs("label", { htmlFor: "terms", className: "ml-2 text-sm text-gray-700", children: ["I agree to the", " ", _jsx(Link, { to: "/terms", className: "text-blue-600 hover:text-blue-700 font-medium", children: "Terms and Conditions" }), " ", "and", " ", _jsx(Link, { to: "/privacy", className: "text-blue-600 hover:text-blue-700 font-medium", children: "Privacy Policy" })] })] }), _jsx(Button, { type: "submit", variant: "primary", fullWidth: true, isLoading: isLoading, disabled: isLoading || !acceptTerms, children: "Create account" })] }), _jsx("div", { className: "mt-6 text-center", children: _jsxs("p", { className: "text-sm text-gray-600", children: ["Already have an account?", " ", _jsx(Link, { to: "/login", className: "font-medium text-blue-600 hover:text-blue-700", children: "Sign in" })] }) })] }) }));
};
export default RegisterPage;
