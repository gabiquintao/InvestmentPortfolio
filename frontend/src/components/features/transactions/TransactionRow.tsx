// ============================================================================
// TransactionRow Component
// Single table row for displaying a transaction
// ============================================================================

import { ShoppingCart, TrendingUp, AlertCircle } from 'lucide-react';
import { type Transaction, TransactionType } from '../../../types';
import { formatCurrency, formatDate } from '../../../utils/formatters';

// ============================================================================
// TYPES
// ============================================================================

interface TransactionRowProps {
  transaction: Transaction;
  currency?: string;
}

// ============================================================================
// TRANSACTION ROW COMPONENT
// ============================================================================

export const TransactionRow = ({
  transaction,
  currency = 'EUR',
}: TransactionRowProps) => {
  // Get type icon and color
  const getTypeStyles = () => {
    switch (transaction.type) {
      case TransactionType.Buy:
        return {
          icon: ShoppingCart,
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-800',
          borderColor: 'border-blue-200',
        };
      case TransactionType.Sell:
        return {
          icon: TrendingUp,
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          borderColor: 'border-green-200',
        };
      default:
        return {
          icon: AlertCircle,
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          borderColor: 'border-gray-200',
        };
    }
  };

  const typeStyles = getTypeStyles();
  const TypeIcon = typeStyles.icon;

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      {/* Date */}
      <td className="px-4 py-4">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-900">
            {formatDate(transaction.transactionDate, 'dd MMM yyyy')}
          </span>
          <span className="text-xs text-gray-500">
            {formatDate(transaction.transactionDate, 'HH:mm')}
          </span>
        </div>
      </td>

      {/* Asset Symbol */}
      <td className="px-4 py-4">
        <span className="font-semibold text-gray-900">
          {transaction.assetSymbol}
        </span>
      </td>

      {/* Type */}
      <td className="px-4 py-4">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${typeStyles.bgColor} ${typeStyles.textColor} ${typeStyles.borderColor}`}>
          <TypeIcon className="h-3.5 w-3.5" />
          <span className="text-xs font-semibold">
            {transaction.typeName}
          </span>
        </div>
      </td>

      {/* Quantity */}
      <td className="px-4 py-4 text-right">
        <span className="text-sm text-gray-900 font-medium">
          {transaction.quantity.toLocaleString()}
        </span>
      </td>

      {/* Price Per Unit */}
      <td className="px-4 py-4 text-right">
        <span className="text-sm text-gray-900">
          {formatCurrency(transaction.pricePerUnit, currency)}
        </span>
      </td>

      {/* Total Amount */}
      <td className="px-4 py-4 text-right">
        <span className={`text-sm font-semibold ${
          transaction.type === TransactionType.Buy ? 'text-red-600' : 
          transaction.type === TransactionType.Sell ? 'text-green-600' : 
          'text-gray-900'
        }`}>
          {transaction.type === TransactionType.Buy && '-'}
          {transaction.type === TransactionType.Sell && '+'}
          {formatCurrency(transaction.totalAmount, currency)}
        </span>
      </td>

      {/* Fees */}
      <td className="px-4 py-4 text-right">
        <span className="text-sm text-gray-600">
          {transaction.fees > 0 ? formatCurrency(transaction.fees, currency) : '-'}
        </span>
      </td>
    </tr>
  );
};

export default TransactionRow;