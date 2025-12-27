// ============================================================================
// TransactionForm Component
// Form for creating new transactions
// ============================================================================

import { useState, useEffect } from "react";
import {
  type CreateTransactionDto,
  TransactionType,
  type Portfolio,
  type Asset,
} from "../../../types";
import { Input } from "../../common/Input";
import { Button } from "../../common/Button";
import { SimplePortfolioSelect } from "../portfolios/PortfolioSelector";
import { formatDateForInput } from "../../../utils/formatters";
import {
  getRequiredFieldError,
  getQuantityError,
  getPriceError,
  getFeesError,
  getDateError,
  hasErrors,
} from "../../../utils/validators";

// ============================================================================
// TYPES
// ============================================================================

interface TransactionFormProps {
  portfolios: Portfolio[];
  assets: Asset[];
  onSubmit: (data: CreateTransactionDto) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  defaultPortfolioId?: number;
  defaultAssetId?: number;
}

// ============================================================================
// TRANSACTION FORM COMPONENT
// ============================================================================

export const TransactionForm = ({
  portfolios,
  assets,
  onSubmit,
  onCancel,
  isLoading = false,
  defaultPortfolioId,
  defaultAssetId,
}: TransactionFormProps) => {
  const [formData, setFormData] = useState({
    portfolioId: defaultPortfolioId || 0,
    assetId: defaultAssetId || 0,
    type: TransactionType.Buy,
    quantity: 0,
    pricePerUnit: 0,
    fees: 0,
    transactionDate: formatDateForInput(new Date()),
    notes: "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>([]);

  // Filter assets when portfolio changes
  useEffect(() => {
    if (formData.portfolioId > 0) {
      const filtered = assets.filter(
        (asset) => asset.portfolioId === formData.portfolioId
      );
      setFilteredAssets(filtered);

      // Reset asset selection if not in filtered list
      if (
        formData.assetId > 0 &&
        !filtered.find((a) => a.assetId === formData.assetId)
      ) {
        setFormData((prev) => ({ ...prev, assetId: 0 }));
      }
    } else {
      setFilteredAssets([]);
    }
  }, [formData.portfolioId, assets, formData.assetId]);

  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ["portfolioId", "assetId", "type"].includes(name)
        ? Number(value)
        : ["quantity", "pricePerUnit", "fees"].includes(name)
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

  // Validate form
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Portfolio
    if (formData.portfolioId === 0) {
      errors.portfolioId = "Please select a portfolio";
    }

    // Asset
    if (formData.assetId === 0) {
      errors.assetId = "Please select an asset";
    }

    // Quantity
    const quantityError = getQuantityError(formData.quantity);
    if (quantityError) errors.quantity = quantityError;

    // Price Per Unit
    const priceError = getPriceError(formData.pricePerUnit, "Price per unit");
    if (priceError) errors.pricePerUnit = priceError;

    // Fees
    const feesError = getFeesError(formData.fees);
    if (feesError) errors.fees = feesError;

    // Date
    const dateError = getDateError(
      formData.transactionDate,
      "Transaction date"
    );
    if (dateError) errors.transactionDate = dateError;

    setFormErrors(errors);
    return !hasErrors(errors);
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    await onSubmit(formData);
  };

  // Calculate total amount
  const totalAmount = formData.quantity * formData.pricePerUnit;
  const totalWithFees = totalAmount + formData.fees;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Portfolio Selection */}
      <SimplePortfolioSelect
        portfolios={portfolios}
        selectedPortfolioId={formData.portfolioId}
        onSelect={(id) => setFormData((prev) => ({ ...prev, portfolioId: id }))}
        label="Portfolio"
        error={formErrors.portfolioId}
        disabled={isLoading || !!defaultPortfolioId}
      />

      {/* Asset Selection */}
      <div>
        <label
          htmlFor="assetId"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Asset
        </label>
        <select
          id="assetId"
          name="assetId"
          value={formData.assetId}
          onChange={handleChange}
          disabled={isLoading || formData.portfolioId === 0 || !!defaultAssetId}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${
            formErrors.assetId ? "border-red-500" : "border-gray-300"
          }`}
        >
          <option value={0}>Select an asset</option>
          {filteredAssets.map((asset) => (
            <option key={asset.assetId} value={asset.assetId}>
              {asset.symbol} - {asset.assetTypeName}
            </option>
          ))}
        </select>
        {formErrors.assetId && (
          <p className="mt-1 text-sm text-red-600">{formErrors.assetId}</p>
        )}
        {formData.portfolioId === 0 && (
          <p className="mt-1 text-sm text-gray-500">Select a portfolio first</p>
        )}
      </div>

      {/* Transaction Type */}
      <div>
        <label
          htmlFor="type"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Transaction Type
        </label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          disabled={isLoading}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          <option value={TransactionType.Buy}>Buy</option>
          <option value={TransactionType.Sell}>Sell</option>
        </select>
      </div>

      {/* Quantity and Price Per Unit Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          type="number"
          name="quantity"
          label="Quantity"
          placeholder="0"
          value={formData.quantity || ""}
          onChange={handleChange}
          error={formErrors.quantity}
          disabled={isLoading}
          step="0.00000001"
          min="0"
          required
        />

        <Input
          type="number"
          name="pricePerUnit"
          label="Price Per Unit"
          placeholder="0.00"
          value={formData.pricePerUnit || ""}
          onChange={handleChange}
          error={formErrors.pricePerUnit}
          disabled={isLoading}
          step="0.01"
          min="0"
          required
        />
      </div>

      {/* Fees and Date Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          type="number"
          name="fees"
          label="Fees (Optional)"
          placeholder="0.00"
          value={formData.fees || ""}
          onChange={handleChange}
          error={formErrors.fees}
          disabled={isLoading}
          step="0.01"
          min="0"
        />

        <Input
          type="date"
          name="transactionDate"
          label="Transaction Date"
          value={formData.transactionDate}
          onChange={handleChange}
          error={formErrors.transactionDate}
          disabled={isLoading}
          max={formatDateForInput(new Date())}
          required
        />
      </div>

      {/* Notes */}
      <div>
        <label
          htmlFor="notes"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Notes (Optional)
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          value={formData.notes}
          onChange={handleChange}
          disabled={isLoading}
          placeholder="Add any notes about this transaction..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
        />
      </div>

      {/* Transaction Summary */}
      {totalAmount > 0 && (
        <div
          className={`p-4 rounded-lg border ${
            formData.type === TransactionType.Buy
              ? "bg-red-50 border-red-200"
              : formData.type === TransactionType.Sell
              ? "bg-green-50 border-green-200"
              : "bg-blue-50 border-blue-200"
          }`}
        >
          <p className="text-sm font-semibold mb-2 text-gray-700">
            Transaction Summary
          </p>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Amount:</span>
              <span className="font-medium text-gray-900">
                €{totalAmount.toFixed(2)}
              </span>
            </div>
            {formData.fees > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Fees:</span>
                <span className="font-medium text-gray-900">
                  €{formData.fees.toFixed(2)}
                </span>
              </div>
            )}
            <div className="flex justify-between pt-2 border-t border-gray-300">
              <span className="font-semibold text-gray-900">Total:</span>
              <span
                className={`font-bold text-lg ${
                  formData.type === TransactionType.Buy
                    ? "text-red-600"
                    : formData.type === TransactionType.Sell
                    ? "text-green-600"
                    : "text-gray-900"
                }`}
              >
                {formData.type === TransactionType.Buy && "-"}
                {formData.type === TransactionType.Sell && "+"}€
                {totalWithFees.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}

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
          Create Transaction
        </Button>
      </div>
    </form>
  );
};

export default TransactionForm;
