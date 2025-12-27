// ============================================================================
// AssetAllocationChart Component
// Pie chart showing portfolio asset allocation by type
// ============================================================================

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import type { AssetAllocation } from "../../../types";
import { formatCurrency } from "../../../utils/formatters";

// ============================================================================
// TYPES
// ============================================================================

interface AssetAllocationChartProps {
  allocations: AssetAllocation[];
  currency?: string;
  showLegend?: boolean;
  height?: number;
}

// Color palette for asset types
const COLORS = {
  Stock: "#3b82f6", // blue-600
  Crypto: "#f59e0b", // amber-500
  Fund: "#10b981", // green-500
  Bond: "#8b5cf6", // purple-500
  Other: "#6b7280", // gray-500
  Cryptocurrency: "#f59e0b",
};

// ============================================================================
// ASSET ALLOCATION CHART COMPONENT
// ============================================================================

export const AssetAllocationChart = ({
  allocations,
  currency = "EUR",
  showLegend = true,
  height = 300,
}: AssetAllocationChartProps) => {
  // Prepare data for chart
  const chartData = allocations.map((allocation) => ({
    name: allocation.type,
    value: allocation.value,
    percentage: allocation.percentage,
    color: COLORS[allocation.type as keyof typeof COLORS] || COLORS.Other,
  }));

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <p className="font-semibold text-gray-900">{data.name}</p>
          <p className="text-sm text-gray-600">
            {formatCurrency(data.value, currency)}
          </p>
          <p className="text-sm font-medium" style={{ color: data.color }}>
            {data.percentage.toFixed(2)}%
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom legend
  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry: any, index: number) => (
          <div key={`legend-${index}`} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-gray-700">
              {entry.value} ({entry.payload.percentage.toFixed(1)}%)
            </span>
          </div>
        ))}
      </div>
    );
  };

  if (allocations.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="text-center text-gray-500">
          <p className="text-sm">No asset allocation data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Asset Allocation
      </h3>

      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ percentage }) => `${percentage.toFixed(1)}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          {showLegend && <Legend content={<CustomLegend />} />}
        </PieChart>
      </ResponsiveContainer>

      {/* Detailed Breakdown */}
      <div className="mt-6 space-y-3">
        {chartData.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm font-medium text-gray-900">
                {item.name}
              </span>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900">
                {formatCurrency(item.value, currency)}
              </p>
              <p className="text-xs text-gray-500">
                {item.percentage.toFixed(2)}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssetAllocationChart;
