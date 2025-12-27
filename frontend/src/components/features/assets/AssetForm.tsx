import { useState, useEffect } from "react";

// Types
interface Asset {
  assetId: number;
  symbol: string;
  assetType: number;
  quantity: number;
  avgPurchasePrice: number;
  purchaseDate: string;
}

interface AssetFormProps {
  asset?: Asset;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const AssetForm = ({
  asset,
  onSubmit,
  onCancel,
  isLoading = false,
}: AssetFormProps) => {
  const [formData, setFormData] = useState({
    symbol: asset?.symbol || "",
    assetType: asset?.assetType || 1,
    quantity: asset?.quantity || 0,
    avgPurchasePrice: asset?.avgPurchasePrice || 0,
    purchaseDate: asset?.purchaseDate
      ? new Date(asset.purchaseDate).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update form when asset prop changes
  useEffect(() => {
    if (asset) {
      setFormData({
        symbol: asset.symbol,
        assetType: asset.assetType,
        quantity: asset.quantity,
        avgPurchasePrice: asset.avgPurchasePrice,
        purchaseDate: new Date(asset.purchaseDate).toISOString().split("T")[0],
      });
    }
  }, [asset]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.symbol.trim()) {
      newErrors.symbol = "Symbol is required";
    }

    if (formData.quantity <= 0) {
      newErrors.quantity = "Quantity must be greater than 0";
    }

    if (formData.avgPurchasePrice <= 0) {
      newErrors.avgPurchasePrice = "Price must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const submitData = {
      ...formData,
      quantity: Number(formData.quantity),
      avgPurchasePrice: Number(formData.avgPurchasePrice),
    };

    onSubmit(submitData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="space-y-4" onKeyPress={handleKeyPress}>
      {/* Symbol */}
      <div>
        <label
          htmlFor="symbol"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Symbol *
        </label>
        <input
          type="text"
          id="symbol"
          name="symbol"
          value={formData.symbol}
          onChange={handleChange}
          disabled={!!asset || isLoading}
          placeholder="e.g., AAPL, BTC"
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.symbol ? "border-red-500" : "border-gray-300"
          } ${asset || isLoading ? "bg-gray-100 cursor-not-allowed" : ""}`}
        />
        {errors.symbol && (
          <p className="text-red-500 text-sm mt-1">{errors.symbol}</p>
        )}
        {asset && (
          <p className="text-gray-500 text-xs mt-1">Symbol cannot be changed</p>
        )}
      </div>

      {/* Asset Type */}
      <div>
        <label
          htmlFor="assetType"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Asset Type *
        </label>
        <select
          id="assetType"
          name="assetType"
          value={formData.assetType}
          onChange={handleChange}
          disabled={isLoading}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
        >
          <option value={1}>Stock</option>
          <option value={2}>Cryptocurrency</option>
          <option value={3}>Bond</option>
          <option value={4}>ETF</option>
          <option value={5}>Mutual Fund</option>
          <option value={6}>Commodity</option>
          <option value={7}>Real Estate</option>
          <option value={8}>Cash</option>
          <option value={9}>Other</option>
        </select>
      </div>

      {/* Quantity */}
      <div>
        <label
          htmlFor="quantity"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Quantity *
        </label>
        <input
          type="number"
          id="quantity"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          disabled={isLoading}
          step="0.00000001"
          min="0"
          placeholder="0.00"
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 ${
            errors.quantity ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.quantity && (
          <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>
        )}
      </div>

      {/* Average Purchase Price */}
      <div>
        <label
          htmlFor="avgPurchasePrice"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Average Purchase Price *
        </label>
        <input
          type="number"
          id="avgPurchasePrice"
          name="avgPurchasePrice"
          value={formData.avgPurchasePrice}
          onChange={handleChange}
          disabled={isLoading}
          step="0.01"
          min="0"
          placeholder="0.00"
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 ${
            errors.avgPurchasePrice ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.avgPurchasePrice && (
          <p className="text-red-500 text-sm mt-1">{errors.avgPurchasePrice}</p>
        )}
      </div>

      {/* Purchase Date */}
      <div>
        <label
          htmlFor="purchaseDate"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Purchase Date *
        </label>
        <input
          type="date"
          id="purchaseDate"
          name="purchaseDate"
          value={formData.purchaseDate}
          onChange={handleChange}
          disabled={isLoading}
          max={new Date().toISOString().split("T")[0]}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
        />
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              {asset ? "Updating..." : "Creating..."}
            </>
          ) : asset ? (
            "Update Asset"
          ) : (
            "Create Asset"
          )}
        </button>
      </div>
    </div>
  );
};

export default AssetForm;
