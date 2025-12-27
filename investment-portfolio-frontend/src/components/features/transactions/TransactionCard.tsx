// ============================================================================
// TransactionCard Component
// Card view of a single transaction with details
// ============================================================================

import { ShoppingCart, TrendingUp, DollarSign, AlertCircle, Calendar, FileText } from 'lucide-react';
import { type Transaction, TransactionType } from '../../../types';
import { formatCurrency, formatDate, formatDateTime } from '../../../utils/formatters';

// ============================================================================
// TYPES
// ============================================================================

interface TransactionCardProps {
  transaction: Transaction;
  currency?: string;
  showDetails?: boolean;
}

// ============================================================================
// TRANSACTION CARD COMPONENT
// ============================================================================

export const TransactionCard = ({
  transaction,
  currency = 'EUR',
  showDetails = true,
}: TransactionCardProps) => {
  // Get type styles
  const getTypeStyles = () => {
    switch (transaction.type) {
      case TransactionType.Buy:
        return {
          icon: ShoppingCart,
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          iconBgColor: 'bg-blue-100',
          iconColor: 'text-blue-600',
          amountColor: 'text-red-600',
          prefix: '-',
        };
      case TransactionType.Sell:
        return {
          icon: TrendingUp,
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          iconBgColor: 'bg-green-100',
          iconColor: 'text-green-600',
          amountColor: 'text-green-600',
          prefix: '+',
        };
      default:
        return {
          icon: AlertCircle,
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          iconBgColor: 'bg-gray-100',
          iconColor: 'text-gray-600',
          amountColor: 'text-gray-900',
          prefix: '',
        };
    }
  };

  const styles = getTypeStyles();
  const TypeIcon = styles.icon;

  return (
    <div className={`rounded-lg border ${styles.borderColor} ${styles.bgColor} p-4 hover:shadow-md transition-shadow`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg ${styles.iconBgColor} flex items-center justify-center`}>
            <TypeIcon className={`h-5 w-5 ${styles.iconColor}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-gray-900">{transaction.assetSymbol}</h4>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${styles.iconBgColor} ${styles.iconColor}`}>
                {transaction.typeName}
              </span>
            </div>
            <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
              <Calendar className="h-3.5 w-3.5" />
              {formatDateTime(transaction.transactionDate)}
            </p>
          </div>
        </div>

        {/* Total Amount */}
        <div className="text-right">
          <p className={`text-2xl font-bold ${styles.amountColor}`}>
            {styles.prefix}{formatCurrency(transaction.totalAmount, currency)}
          </p>
          {transaction.fees > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              +{formatCurrency(transaction.fees, currency)} fees
            </p>
          )}
        </div>
      </div>

      {/* Details */}
      {showDetails && (
        <>
          <div className="grid grid-cols-2 gap-3 py-3 border-t border-gray-200">
            <div>
              <p className="text-xs text-gray-500 mb-1">Quantity</p>
              <p className="text-sm font-semibold text-gray-900">
                {transaction.quantity.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Price per Unit</p>
              <p className="text-sm font-semibold text-gray-900">
                {formatCurrency(transaction.pricePerUnit, currency)}
              </p>
            </div>
          </div>

          {/* Notes */}
          {transaction.notes && (
            <div className="pt-3 border-t border-gray-200">
              <div className="flex items-start gap-2">
                <FileText className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-600">{transaction.notes}</p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TransactionCard;