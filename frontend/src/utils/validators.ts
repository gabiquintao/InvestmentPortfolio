// ============================================================================
// Validators Utility
// Helper functions for validation of forms, inputs, and business logic
// ============================================================================

import { AssetType, TransactionType, AlertCondition } from "../types";

// ============================================================================
// EMAIL VALIDATORS
// ============================================================================

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Get email validation error message
 */
export const getEmailError = (email: string): string | null => {
  if (!email || email.trim() === "") {
    return "Email is required";
  }
  if (!isValidEmail(email)) {
    return "Please enter a valid email address";
  }
  return null;
};

// ============================================================================
// PASSWORD VALIDATORS
// ============================================================================

/**
 * Validate password strength
 * Requirements: min 8 characters, at least 1 uppercase, 1 lowercase, 1 number
 */
export const isValidPassword = (password: string): boolean => {
  if (password.length < 8) return false;

  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  return hasUppercase && hasLowercase && hasNumber;
};

/**
 * Get password validation error message
 */
export const getPasswordError = (password: string): string | null => {
  if (!password || password.trim() === "") {
    return "Password is required";
  }
  if (password.length < 8) {
    return "Password must be at least 8 characters long";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter";
  }
  if (!/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase letter";
  }
  if (!/[0-9]/.test(password)) {
    return "Password must contain at least one number";
  }
  return null;
};

/**
 * Validate password confirmation
 */
export const isPasswordMatch = (
  password: string,
  confirmPassword: string
): boolean => {
  return password === confirmPassword;
};

/**
 * Get password confirmation error message
 */
export const getPasswordConfirmError = (
  password: string,
  confirmPassword: string
): string | null => {
  if (!confirmPassword || confirmPassword.trim() === "") {
    return "Please confirm your password";
  }
  if (!isPasswordMatch(password, confirmPassword)) {
    return "Passwords do not match";
  }
  return null;
};

/**
 * Calculate password strength (0-4)
 */
export const getPasswordStrength = (
  password: string
): {
  score: number;
  label: string;
  color: string;
} => {
  let score = 0;

  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const strengths = [
    { label: "Very Weak", color: "bg-red-500" },
    { label: "Weak", color: "bg-orange-500" },
    { label: "Fair", color: "bg-yellow-500" },
    { label: "Good", color: "bg-blue-500" },
    { label: "Strong", color: "bg-green-500" },
  ];

  return {
    score,
    label: strengths[score].label,
    color: strengths[score].color,
  };
};

// ============================================================================
// NUMERIC VALIDATORS
// ============================================================================

/**
 * Validate if value is a positive number
 */
export const isPositiveNumber = (value: number): boolean => {
  return !isNaN(value) && value > 0;
};

/**
 * Validate if value is a non-negative number
 */
export const isNonNegativeNumber = (value: number): boolean => {
  return !isNaN(value) && value >= 0;
};

/**
 * Validate quantity (must be positive)
 */
export const isValidQuantity = (quantity: number): boolean => {
  return isPositiveNumber(quantity);
};

/**
 * Get quantity validation error message
 */
export const getQuantityError = (quantity: number): string | null => {
  if (isNaN(quantity)) {
    return "Quantity must be a valid number";
  }
  if (!isValidQuantity(quantity)) {
    return "Quantity must be greater than 0";
  }
  return null;
};

/**
 * Validate price (must be positive)
 */
export const isValidPrice = (price: number): boolean => {
  return isPositiveNumber(price);
};

/**
 * Get price validation error message
 */
export const getPriceError = (
  price: number,
  fieldName: string = "Price"
): string | null => {
  if (isNaN(price)) {
    return `${fieldName} must be a valid number`;
  }
  if (!isValidPrice(price)) {
    return `${fieldName} must be greater than 0`;
  }
  return null;
};

/**
 * Validate fees (must be non-negative)
 */
export const isValidFees = (fees: number): boolean => {
  return isNonNegativeNumber(fees);
};

/**
 * Get fees validation error message
 */
export const getFeesError = (fees: number): string | null => {
  if (isNaN(fees)) {
    return "Fees must be a valid number";
  }
  if (!isValidFees(fees)) {
    return "Fees cannot be negative";
  }
  return null;
};

// ============================================================================
// STRING VALIDATORS
// ============================================================================

/**
 * Validate if string is not empty
 */
export const isNotEmpty = (value: string): boolean => {
  return value !== null && value !== undefined && value.trim() !== "";
};

/**
 * Get required field error message
 */
export const getRequiredFieldError = (
  value: string,
  fieldName: string
): string | null => {
  if (!isNotEmpty(value)) {
    return `${fieldName} is required`;
  }
  return null;
};

/**
 * Validate string length
 */
export const isValidLength = (
  value: string,
  min: number,
  max: number
): boolean => {
  const length = value.trim().length;
  return length >= min && length <= max;
};

/**
 * Get length validation error message
 */
export const getLengthError = (
  value: string,
  min: number,
  max: number,
  fieldName: string
): string | null => {
  const length = value.trim().length;
  if (length < min) {
    return `${fieldName} must be at least ${min} characters long`;
  }
  if (length > max) {
    return `${fieldName} must be no more than ${max} characters long`;
  }
  return null;
};

// ============================================================================
// SYMBOL VALIDATORS
// ============================================================================

/**
 * Validate asset symbol format (alphanumeric, dashes allowed)
 */
export const isValidSymbol = (symbol: string): boolean => {
  if (!isNotEmpty(symbol)) return false;
  const symbolRegex = /^[A-Z0-9-]+$/i;
  return symbolRegex.test(symbol);
};

/**
 * Get symbol validation error message
 */
export const getSymbolError = (symbol: string): string | null => {
  if (!isNotEmpty(symbol)) {
    return "Symbol is required";
  }
  if (!isValidSymbol(symbol)) {
    return "Symbol can only contain letters, numbers, and dashes";
  }
  if (symbol.length > 10) {
    return "Symbol must be no more than 10 characters";
  }
  return null;
};

// ============================================================================
// DATE VALIDATORS
// ============================================================================

/**
 * Validate if date is not in the future
 */
export const isNotFutureDate = (date: Date | string): boolean => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj <= new Date();
};

/**
 * Validate if date is valid
 */
export const isValidDate = (date: Date | string): boolean => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj instanceof Date && !isNaN(dateObj.getTime());
};

/**
 * Get date validation error message
 */
export const getDateError = (
  date: Date | string,
  fieldName: string = "Date"
): string | null => {
  if (!date) {
    return `${fieldName} is required`;
  }
  if (!isValidDate(date)) {
    return `${fieldName} is not valid`;
  }
  if (!isNotFutureDate(date)) {
    return `${fieldName} cannot be in the future`;
  }
  return null;
};

// ============================================================================
// ENUM VALIDATORS
// ============================================================================

/**
 * Validate asset type
 */
export const isValidAssetType = (assetType: number): boolean => {
  return Object.values(AssetType).includes(assetType);
};

/**
 * Get asset type validation error message
 */
export const getAssetTypeError = (assetType: number): string | null => {
  if (!isValidAssetType(assetType)) {
    return "Please select a valid asset type";
  }
  return null;
};

/**
 * Validate transaction type
 */
export const isValidTransactionType = (transactionType: number): boolean => {
  return Object.values(TransactionType).includes(transactionType);
};

/**
 * Get transaction type validation error message
 */
export const getTransactionTypeError = (
  transactionType: number
): string | null => {
  if (!isValidTransactionType(transactionType)) {
    return "Please select a valid transaction type";
  }
  return null;
};

/**
 * Validate alert condition
 */
export const isValidAlertCondition = (condition: number): boolean => {
  return Object.values(AlertCondition).includes(condition);
};

/**
 * Get alert condition validation error message
 */
export const getAlertConditionError = (condition: number): string | null => {
  if (!isValidAlertCondition(condition)) {
    return "Please select a valid alert condition";
  }
  return null;
};

// ============================================================================
// CURRENCY VALIDATORS
// ============================================================================

/**
 * Validate currency code (3 uppercase letters)
 */
export const isValidCurrency = (currency: string): boolean => {
  const currencyRegex = /^[A-Z]{3}$/;
  return currencyRegex.test(currency);
};

/**
 * Get currency validation error message
 */
export const getCurrencyError = (currency: string): string | null => {
  if (!isNotEmpty(currency)) {
    return "Currency is required";
  }
  if (!isValidCurrency(currency)) {
    return "Currency must be a valid 3-letter code (e.g., EUR, USD)";
  }
  return null;
};

// ============================================================================
// PORTFOLIO VALIDATORS
// ============================================================================

/**
 * Validate portfolio name
 */
export const isValidPortfolioName = (name: string): boolean => {
  return isNotEmpty(name) && isValidLength(name, 3, 100);
};

/**
 * Get portfolio name validation error message
 */
export const getPortfolioNameError = (name: string): string | null => {
  const requiredError = getRequiredFieldError(name, "Portfolio name");
  if (requiredError) return requiredError;

  return getLengthError(name, 3, 100, "Portfolio name");
};

// ============================================================================
// FULL NAME VALIDATORS
// ============================================================================

/**
 * Validate full name (at least 2 words)
 */
export const isValidFullName = (fullName: string): boolean => {
  if (!isNotEmpty(fullName)) return false;
  const words = fullName.trim().split(/\s+/);
  return words.length >= 2 && words.every((word) => word.length >= 2);
};

/**
 * Get full name validation error message
 */
export const getFullNameError = (fullName: string): string | null => {
  if (!isNotEmpty(fullName)) {
    return "Full name is required";
  }
  if (!isValidFullName(fullName)) {
    return "Please enter your first and last name";
  }
  return null;
};

// ============================================================================
// COMPOSITE VALIDATORS
// ============================================================================

/**
 * Validate entire portfolio form
 */
export const validatePortfolioForm = (data: {
  name: string;
  description: string;
  currency: string;
}): Record<string, string> => {
  const errors: Record<string, string> = {};

  const nameError = getPortfolioNameError(data.name);
  if (nameError) errors.name = nameError;

  const descriptionError = getLengthError(
    data.description,
    0,
    500,
    "Description"
  );
  if (descriptionError) errors.description = descriptionError;

  const currencyError = getCurrencyError(data.currency);
  if (currencyError) errors.currency = currencyError;

  return errors;
};

/**
 * Validate entire asset form
 */
export const validateAssetForm = (data: {
  symbol: string;
  assetType: number;
  quantity: number;
  avgPurchasePrice: number;
  purchaseDate: string;
}): Record<string, string> => {
  const errors: Record<string, string> = {};

  const symbolError = getSymbolError(data.symbol);
  if (symbolError) errors.symbol = symbolError;

  const assetTypeError = getAssetTypeError(data.assetType);
  if (assetTypeError) errors.assetType = assetTypeError;

  const quantityError = getQuantityError(data.quantity);
  if (quantityError) errors.quantity = quantityError;

  const priceError = getPriceError(
    data.avgPurchasePrice,
    "Average purchase price"
  );
  if (priceError) errors.avgPurchasePrice = priceError;

  const dateError = getDateError(data.purchaseDate, "Purchase date");
  if (dateError) errors.purchaseDate = dateError;

  return errors;
};

/**
 * Check if form has any errors
 */
export const hasErrors = (errors: Record<string, string>): boolean => {
  return Object.keys(errors).length > 0;
};
