// ============================================================================
// AssetAllocationChart Component
// Pie chart showing portfolio asset allocation
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

interface AssetAllocationChartProps {
  allocations: AssetAllocation[];
  currency?: string;
  showLegend?: boolean;
  height?: number;
}

// Color palette for asset types (use o que fizer sentido)
const COLORS = {
  Stock: "#3b82f6",
  Crypto: "#f59e0b",
  Fund: "#10b981",
  Bond: "#8b5cf6",
  Other: "#6b7280",
};

// -----------------------------------------------------------------------------
// Custom Tooltip (fora do render para evitar ESLint react-hooks/static-components)
// -----------------------------------------------------------------------------
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
        <p className="font-semibold text-gray-900">Value</p>
        <p className="text-sm text-gray-600">{formatCurrency(data.value)}</p>
      </div>
    );
  }
  return null;
};

// -----------------------------------------------------------------------------
// Custom Legend (fora do render)
// -----------------------------------------------------------------------------
const CustomLegend = ({ payload }: any) => {
  return (
    <div className="flex flex-wrap justify-center gap-4 mt-4">
      {payload.map((entry: any, index: number) => (
        <div key={`legend-${index}`} className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm text-gray-700">{entry.value}</span>
        </div>
      ))}
    </div>
  );
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
  if (!allocations || allocations.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="text-center text-gray-500">
          <p className="text-sm">No asset allocation data available</p>
        </div>
      </div>
    );
  }

  // Apenas usa `value` do tipo AssetAllocation
  const chartData = allocations.map((allocation, index) => ({
    value: allocation.value ?? 0,
    key: index,
  }));

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Asset Allocation
      </h3>

      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            cx="50%"
            cy="50%"
            outerRadius={100}
            labelLine={false}
            label={(entry) => `${entry.value}`}
          >
            {chartData.map((entry) => (
              <Cell key={entry.key} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          {showLegend && <Legend content={<CustomLegend />} />}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AssetAllocationChart;
