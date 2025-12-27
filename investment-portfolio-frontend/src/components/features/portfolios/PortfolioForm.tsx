// ============================================================================
// PortfolioForm Component
// Form for creating and editing portfolios with validation
// ============================================================================

import { useState, useEffect } from "react";
import type {
  Portfolio,
  CreatePortfolioDto,
  UpdatePortfolioDto,
} from "../../../types";
import { Input } from "../../common/Input";
import { Button } from "../../common/Button";
import { validatePortfolioForm, hasErrors } from "../../../utils/validators";

// ============================================================================
// TYPES
// ============================================================================

interface PortfolioFormProps {
  portfolio?: Portfolio;
  onSubmit: (data: CreatePortfolioDto | UpdatePortfolioDto) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

// Common currencies
const CURRENCIES = [
  { code: "EUR", name: "Euro (€)", symbol: "€" },
  { code: "USD", name: "US Dollar ($)", symbol: "$" },
  { code: "GBP", name: "British Pound (£)", symbol: "£" },
  { code: "JPY", name: "Japanese Yen (¥)", symbol: "¥" },
  { code: "CHF", name: "Swiss Franc (CHF)", symbol: "CHF" },
];

// ============================================================================
// PORTFOLIO FORM COMPONENT
// ============================================================================

export const PortfolioForm = ({
  portfolio,
  onSubmit,
  onCancel,
  isLoading = false,
}: PortfolioFormProps) => {
  const isEditMode = !!portfolio;

  const [formData, setFormData] = useState({
    name: portfolio?.name || "",
    description: portfolio?.description || "",
    currency: portfolio?.currency || "EUR",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Update form when portfolio changes (edit mode)
  useEffect(() => {
    if (portfolio) {
      setFormData({
        name: portfolio.name,
        description: portfolio.description,
        currency: portfolio.currency,
      });
    }
  }, [portfolio]);

  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear field error on change
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const errors = validatePortfolioForm(formData);
    if (hasErrors(errors)) {
      setFormErrors(errors);
      return;
    }

    // Submit form
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Portfolio Name */}
      <Input
        type="text"
        name="name"
        label="Portfolio Name"
        placeholder="e.g., Tech Stocks, Crypto Portfolio"
        value={formData.name}
        onChange={handleChange}
        error={formErrors.name}
        disabled={isLoading}
        helperText="Choose a descriptive name for your portfolio"
        required
      />

      {/* Description */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          value={formData.description}
          onChange={handleChange}
          disabled={isLoading}
          placeholder="Add a description for this portfolio (optional)"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
        />
        {formErrors.description && (
          <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>
        )}
        <p className="mt-1 text-sm text-gray-500">
          {formData.description.length}/500 characters
        </p>
      </div>

      {/* Currency */}
      <div>
        <label
          htmlFor="currency"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Base Currency
        </label>
        <select
          id="currency"
          name="currency"
          value={formData.currency}
          onChange={handleChange}
          disabled={isLoading}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          {CURRENCIES.map((curr) => (
            <option key={curr.code} value={curr.code}>
              {curr.name}
            </option>
          ))}
        </select>
        {formErrors.currency && (
          <p className="mt-1 text-sm text-red-600">{formErrors.currency}</p>
        )}
        <p className="mt-1 text-sm text-gray-500">
          All values will be displayed in {formData.currency}
        </p>
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          disabled={isLoading}
        >
          {isEditMode ? "Update Portfolio" : "Create Portfolio"}
        </Button>
      </div>
    </form>
  );
};

export default PortfolioForm;
