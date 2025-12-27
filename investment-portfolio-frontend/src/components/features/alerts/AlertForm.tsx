// ============================================================================
// AlertForm Component
// Form for creating and editing alerts
// ============================================================================

import { useState, useEffect } from "react";
import {
  type Alert,
  type CreateAlertDto,
  type UpdateAlertDto,
  AlertCondition,
} from "../../../types";
import { Input } from "../../common/Input";
import { Button } from "../../common/Button";
import AssetSearchBar from "../assets/AssetSearchBar";
import {
  getSymbolError,
  getPriceError,
  hasErrors,
} from "../../../utils/validators";

// ============================================================================
// TYPES
// ============================================================================

interface AlertFormProps {
  alert?: Alert;
  onSubmit: (data: CreateAlertDto | UpdateAlertDto) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

// ============================================================================
// ALERT FORM COMPONENT
// ============================================================================

export const AlertForm = ({
  alert,
  onSubmit,
  onCancel,
  isLoading = false,
}: AlertFormProps) => {
  const isEditMode = !!alert;

  const [formData, setFormData] = useState({
    assetSymbol: alert?.assetSymbol || "",
    condition: alert?.condition || AlertCondition.Above,
    targetPrice: alert?.targetPrice || 0,
    isActive: alert?.isActive ?? true,
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Update form when alert changes (edit mode)
  useEffect(() => {
    if (alert) {
      setFormData({
        assetSymbol: alert.assetSymbol,
        condition: alert.condition,
        targetPrice: alert.targetPrice,
        isActive: alert.isActive,
      });
    }
  }, [alert]);

  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : name === "condition"
          ? Number(value)
          : name === "targetPrice"
          ? Number(value)
          : value,
    }));

    // Clear field error on change
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle symbol selection from search bar
  const handleSymbolSelect = (symbol: string) => {
    setFormData((prev) => ({ ...prev, assetSymbol: symbol }));
    if (formErrors.assetSymbol) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.assetSymbol;
        return newErrors;
      });
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Symbol
    const symbolError = getSymbolError(formData.assetSymbol);
    if (symbolError) errors.assetSymbol = symbolError;

    // Target Price
    const priceError = getPriceError(formData.targetPrice, "Target price");
    if (priceError) errors.targetPrice = priceError;

    setFormErrors(errors);
    return !hasErrors(errors);
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (isEditMode) {
      // Edit mode: only send targetPrice and isActive
      await onSubmit({
        targetPrice: formData.targetPrice,
        isActive: formData.isActive,
      } as UpdateAlertDto);
    } else {
      // Create mode: send all fields
      await onSubmit({
        assetSymbol: formData.assetSymbol,
        condition: formData.condition,
        targetPrice: formData.targetPrice,
      } as CreateAlertDto);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Asset Symbol */}
      {!isEditMode ? (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Asset Symbol
          </label>
          <AssetSearchBar
            onSelect={handleSymbolSelect}
            disabled={isLoading}
            error={formErrors.assetSymbol}
            initialValue={formData.assetSymbol}
          />
          {formErrors.assetSymbol && (
            <p className="mt-1 text-sm text-red-600">
              {formErrors.assetSymbol}
            </p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            Search for the asset you want to monitor
          </p>
        </div>
      ) : (
        <Input
          type="text"
          name="assetSymbol"
          label="Asset Symbol"
          value={formData.assetSymbol}
          disabled
          helperText="Asset symbol cannot be changed after creation"
        />
      )}

      {/* Condition */}
      {!isEditMode && (
        <div>
          <label
            htmlFor="condition"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Alert Condition
          </label>
          <select
            id="condition"
            name="condition"
            value={formData.condition}
            onChange={handleChange}
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value={AlertCondition.Above}>Price Above Target</option>
            <option value={AlertCondition.Below}>Price Below Target</option>
          </select>
          <p className="mt-1 text-sm text-gray-500">
            You'll be notified when the price crosses this threshold
          </p>
        </div>
      )}

      {/* Target Price */}
      <Input
        type="number"
        name="targetPrice"
        label="Target Price"
        placeholder="0.00"
        value={formData.targetPrice || ""}
        onChange={handleChange}
        error={formErrors.targetPrice}
        disabled={isLoading}
        step="0.01"
        min="0"
        required
        helperText={
          isEditMode && alert
            ? `Currently set to trigger when price is ${alert.conditionName.toLowerCase()}`
            : undefined
        }
      />

      {/* Active Status (Edit Mode Only) */}
      {isEditMode && (
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div>
            <label htmlFor="isActive" className="font-medium text-gray-900">
              Alert Status
            </label>
            <p className="text-sm text-gray-600">
              {formData.isActive
                ? "Currently monitoring price"
                : "Alert is paused"}
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              disabled={isLoading}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      )}

      {/* Info Box */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          {isEditMode ? (
            <>You'll receive a notification when this alert is triggered.</>
          ) : (
            <>
              You'll receive a notification when{" "}
              {formData.assetSymbol || "this asset"} price goes{" "}
              {formData.condition === AlertCondition.Above ? "above" : "below"}{" "}
              €{formData.targetPrice.toFixed(2)}.
            </>
          )}
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
          {isEditMode ? "Update Alert" : "Create Alert"}
        </Button>
      </div>
    </form>
  );
};

export default AlertForm;
