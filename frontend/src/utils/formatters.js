// ============================================================================
// Formatters Utility
// Helper functions for formatting numbers, dates, currencies, and other data
// ============================================================================
import { format, formatDistanceToNow, parseISO, isValid } from "date-fns";
import { AssetType, TransactionType, AlertCondition } from "../types";
// ============================================================================
// CURRENCY FORMATTERS
// ============================================================================
/**
 * Format number as currency
 * @param value - Number to format
 * @param currency - Currency code (default: EUR)
 * @param locale - Locale for formatting (default: pt-PT)
 */
export const formatCurrency = (value, currency = "EUR", locale = "pt-PT") => {
    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
};
/**
 * Format currency with compact notation for large numbers
 * Example: 1,234,567.89 -> €1.23M
 */
export const formatCurrencyCompact = (value, currency = "EUR", locale = "pt-PT") => {
    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency,
        notation: "compact",
        maximumFractionDigits: 2,
    }).format(value);
};
/**
 * Format number as percentage
 */
export const formatPercentage = (value, decimals = 2) => {
    const sign = value >= 0 ? "+" : "";
    return `${sign}${value.toFixed(decimals)}%`;
};
/**
 * Format percentage with color indicator for UI
 */
export const formatPercentageWithSign = (value) => {
    const isPositive = value >= 0;
    return {
        formatted: formatPercentage(value),
        color: isPositive ? "text-green-600" : "text-red-600",
        isPositive,
    };
};
// ============================================================================
// NUMBER FORMATTERS
// ============================================================================
/**
 * Format large numbers with abbreviations (K, M, B)
 */
export const formatNumber = (value, decimals = 2) => {
    if (value >= 1e9) {
        return `${(value / 1e9).toFixed(decimals)}B`;
    }
    else if (value >= 1e6) {
        return `${(value / 1e6).toFixed(decimals)}M`;
    }
    else if (value >= 1e3) {
        return `${(value / 1e3).toFixed(decimals)}K`;
    }
    return value.toFixed(decimals);
};
/**
 * Format number with thousands separator
 */
export const formatNumberWithCommas = (value, locale = "pt-PT") => {
    return new Intl.NumberFormat(locale, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(value);
};
/**
 * Format volume (trading volume)
 */
export const formatVolume = (value) => {
    return formatNumber(value, 2);
};
// ============================================================================
// DATE FORMATTERS
// ============================================================================
/**
 * Format date to readable string
 * @param date - Date string or Date object
 * @param formatStr - Format pattern (default: 'dd/MM/yyyy')
 */
export const formatDate = (date, formatStr = "dd/MM/yyyy") => {
    try {
        const dateObj = typeof date === "string" ? parseISO(date) : date;
        if (!isValid(dateObj))
            return "Invalid date";
        return format(dateObj, formatStr);
    }
    catch {
        return "Invalid date";
    }
};
/**
 * Format date and time
 */
export const formatDateTime = (date) => {
    return formatDate(date, "dd/MM/yyyy HH:mm");
};
/**
 * Format date to relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (date) => {
    try {
        const dateObj = typeof date === "string" ? parseISO(date) : date;
        if (!isValid(dateObj))
            return "Invalid date";
        return formatDistanceToNow(dateObj, { addSuffix: true });
    }
    catch {
        return "Invalid date";
    }
};
/**
 * Format date for input field (YYYY-MM-DD)
 */
export const formatDateForInput = (date) => {
    return formatDate(date, "yyyy-MM-dd");
};
/**
 * Format date to short format (e.g., Jan 15, 2024)
 */
export const formatDateShort = (date) => {
    return formatDate(date, "MMM dd, yyyy");
};
/**
 * Format date to month and year (e.g., January 2024)
 */
export const formatMonthYear = (date) => {
    return formatDate(date, "MMMM yyyy");
};
// ============================================================================
// ENUM FORMATTERS
// ============================================================================
/**
 * Get asset type display name
 */
export const formatAssetType = (assetType) => {
    const assetTypeNames = {
        [AssetType.Stock]: "Stock",
        [AssetType.Crypto]: "Cryptocurrency",
    };
    return assetTypeNames[assetType] || "Unknown";
};
/**
 * Get transaction type display name
 */
export const formatTransactionType = (transactionType) => {
    const transactionTypeNames = {
        [TransactionType.Buy]: "Buy",
        [TransactionType.Sell]: "Sell",
    };
    return transactionTypeNames[transactionType] || "Unknown";
};
/**
 * Get alert condition display name
 */
export const formatAlertCondition = (condition) => {
    const conditionNames = {
        [AlertCondition.Above]: "Above Target",
        [AlertCondition.Below]: "Below Target",
    };
    return conditionNames[condition] || "Unknown";
};
// ============================================================================
// SYMBOL FORMATTERS
// ============================================================================
/**
 * Format asset symbol for display (uppercase, trimmed)
 */
export const formatSymbol = (symbol) => {
    return symbol.toUpperCase().trim();
};
/**
 * Format symbol with exchange info
 */
export const formatSymbolWithExchange = (symbol, exchange) => {
    const formattedSymbol = formatSymbol(symbol);
    return exchange ? `${formattedSymbol} (${exchange})` : formattedSymbol;
};
// ============================================================================
// GAIN/LOSS FORMATTERS
// ============================================================================
/**
 * Format gain/loss with color and sign
 */
export const formatGainLoss = (value, currency = "EUR") => {
    const isPositive = value >= 0;
    const sign = isPositive ? "+" : "";
    return {
        formatted: `${sign}${formatCurrency(value, currency)}`,
        color: isPositive ? "text-green-600" : "text-red-600",
        isPositive,
    };
};
/**
 * Calculate and format gain/loss percentage
 */
export const calculateGainLossPercent = (currentValue, purchaseValue) => {
    if (purchaseValue === 0)
        return 0;
    return ((currentValue - purchaseValue) / purchaseValue) * 100;
};
// ============================================================================
// TEXT FORMATTERS
// ============================================================================
/**
 * Truncate text to specified length
 */
export const truncateText = (text, maxLength) => {
    if (text.length <= maxLength)
        return text;
    return `${text.substring(0, maxLength)}...`;
};
/**
 * Capitalize first letter of string
 */
export const capitalizeFirst = (text) => {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};
/**
 * Convert snake_case or camelCase to Title Case
 */
export const toTitleCase = (text) => {
    return text
        .replace(/([A-Z])/g, " $1")
        .replace(/_/g, " ")
        .split(" ")
        .map((word) => capitalizeFirst(word))
        .join(" ")
        .trim();
};
// ============================================================================
// VALIDATION STATUS FORMATTERS
// ============================================================================
/**
 * Format boolean to Yes/No
 */
export const formatBoolean = (value) => {
    return value ? "Yes" : "No";
};
/**
 * Format active status with badge
 */
export const formatActiveStatus = (isActive) => {
    return isActive
        ? { text: "Active", color: "bg-green-100 text-green-800" }
        : { text: "Inactive", color: "bg-gray-100 text-gray-800" };
};
/**
 * Format alert status
 */
export const formatAlertStatus = (isActive, triggeredAt) => {
    if (triggeredAt) {
        return { text: "Triggered", color: "bg-yellow-100 text-yellow-800" };
    }
    return formatActiveStatus(isActive);
};
// ============================================================================
// CHART DATA FORMATTERS
// ============================================================================
/**
 * Format value for chart tooltip
 */
export const formatChartValue = (value, type) => {
    switch (type) {
        case "currency":
            return formatCurrency(value);
        case "percentage":
            return formatPercentage(value);
        case "number":
        default:
            return formatNumberWithCommas(value);
    }
};
/**
 * Format axis label for chart
 */
export const formatChartAxisLabel = (value, compact = true) => {
    return compact ? formatNumber(value) : formatNumberWithCommas(value);
};
