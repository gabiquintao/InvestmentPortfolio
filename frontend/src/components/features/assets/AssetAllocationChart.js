import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// ============================================================================
// AssetAllocationChart Component
// Pie chart showing portfolio asset allocation
// ============================================================================
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, } from "recharts";
import { formatCurrency } from "../../../utils/formatters";
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
const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (_jsxs("div", { className: "bg-white border border-gray-200 rounded-lg shadow-lg p-3", children: [_jsx("p", { className: "font-semibold text-gray-900", children: "Value" }), _jsx("p", { className: "text-sm text-gray-600", children: formatCurrency(data.value) })] }));
    }
    return null;
};
// -----------------------------------------------------------------------------
// Custom Legend (fora do render)
// -----------------------------------------------------------------------------
const CustomLegend = ({ payload }) => {
    return (_jsx("div", { className: "flex flex-wrap justify-center gap-4 mt-4", children: payload.map((entry, index) => (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-3 h-3 rounded-full", style: { backgroundColor: entry.color } }), _jsx("span", { className: "text-sm text-gray-700", children: entry.value })] }, `legend-${index}`))) }));
};
// ============================================================================
// ASSET ALLOCATION CHART COMPONENT
// ============================================================================
export const AssetAllocationChart = ({ allocations, currency = "EUR", showLegend = true, height = 300, }) => {
    if (!allocations || allocations.length === 0) {
        return (_jsx("div", { className: "bg-white rounded-lg border border-gray-200 p-8", children: _jsx("div", { className: "text-center text-gray-500", children: _jsx("p", { className: "text-sm", children: "No asset allocation data available" }) }) }));
    }
    // Apenas usa `value` do tipo AssetAllocation
    const chartData = allocations.map((allocation, index) => ({
        value: allocation.value ?? 0,
        key: index,
    }));
    return (_jsxs("div", { className: "bg-white rounded-lg border border-gray-200 p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Asset Allocation" }), _jsx(ResponsiveContainer, { width: "100%", height: height, children: _jsxs(PieChart, { children: [_jsx(Pie, { data: chartData, dataKey: "value", cx: "50%", cy: "50%", outerRadius: 100, labelLine: false, label: (entry) => `${entry.value}`, children: chartData.map((entry) => (_jsx(Cell, {}, entry.key))) }), _jsx(Tooltip, { content: _jsx(CustomTooltip, {}) }), showLegend && _jsx(Legend, { content: _jsx(CustomLegend, {}) })] }) })] }));
};
export default AssetAllocationChart;
