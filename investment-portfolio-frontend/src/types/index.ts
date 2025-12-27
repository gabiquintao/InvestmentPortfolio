// ============================================================================
// Investment Portfolio - TypeScript Type Definitions
// Based on backend DTOs and domain models
// ============================================================================

// ============================================================================
// ENUMS
// ============================================================================

export enum AssetType {
  Stock = 1,
  Crypto = 2,
}

export enum TransactionType {
  Buy = 1,
  Sell = 2,
}

export enum AlertCondition {
  Above = 1,
  Below = 2,
}

// ============================================================================
// AUTH TYPES
// ============================================================================

export interface User {
  userId: number;
  email: string;
  fullName: string;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
}

export interface AuthResponse {
  token: string;
  expiresAt: string;
  user: User;
}

// ============================================================================
// PORTFOLIO TYPES
// ============================================================================

export interface Portfolio {
  portfolioId: number;
  userId: number;
  name: string;
  description: string;
  currency: string;
  createdAt: string;
}

export interface CreatePortfolioDto {
  name: string;
  description: string;
  currency: string;
}

export interface UpdatePortfolioDto {
  name: string;
  description: string;
  currency: string;
}

export interface PortfolioSummary {
  portfolioId: number;
  portfolioName: string;
  totalValue: number;
  totalGainLoss: number;
  totalAssets: number;
  topHoldings: Asset[];
}

// ============================================================================
// ASSET TYPES
// ============================================================================

export interface Asset {
  assetId: number;
  portfolioId: number;
  symbol: string;
  assetType: AssetType;
  assetTypeName: string;
  quantity: number;
  avgPurchasePrice: number;
  purchaseDate: string;
  currentValue: number;
  gainLoss: number;
}

export interface CreateAssetDto {
  symbol: string;
  assetType: AssetType;
  quantity: number;
  avgPurchasePrice: number;
  purchaseDate: string;
}

export interface UpdateAssetDto {
  quantity: number;
  avgPurchasePrice: number;
}

// ============================================================================
// TRANSACTION TYPES
// ============================================================================

export interface Transaction {
  transactionId: number;
  portfolioId: number;
  assetId: number;
  assetSymbol: string;
  type: TransactionType;
  typeName: string;
  quantity: number;
  pricePerUnit: number;
  totalAmount: number;
  fees: number;
  transactionDate: string;
  notes: string;
}

export interface CreateTransactionDto {
  portfolioId: number;
  assetId: number;
  type: TransactionType;
  quantity: number;
  pricePerUnit: number;
  fees: number;
  transactionDate: string;
  notes: string;
}

// ============================================================================
// ALERT TYPES
// ============================================================================

export interface Alert {
  alertId: number;
  userId: number;
  assetSymbol: string;
  condition: AlertCondition;
  conditionName: string;
  targetPrice: number;
  isActive: boolean;
  createdAt: string;
  triggeredAt: string | null;
}

export interface CreateAlertDto {
  assetSymbol: string;
  condition: AlertCondition;
  targetPrice: number;
}

export interface UpdateAlertDto {
  targetPrice: number;
  isActive: boolean;
}

// ============================================================================
// MARKET DATA TYPES
// ============================================================================

export interface MarketPrice {
  symbol: string;
  currentPrice: number;
  change24h: number;
  changePercent24h: number;
  volume24h: number;
  lastUpdated: string;
  source: string;
}

export interface AssetSearchResult {
  symbol: string;
  name: string;
  type: string;
  exchange: string;
}

export interface TrendingAsset {
  symbol: string;
  name: string;
  currentPrice: number;
  changePercent24h: number;
  volume24h: number;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors: string[];
  timestamp: string;
}

// ============================================================================
// UI STATE TYPES
// ============================================================================

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface PaginationState {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface FilterState {
  searchQuery: string;
  assetType?: AssetType;
  dateFrom?: string;
  dateTo?: string;
}

// ============================================================================
// DASHBOARD TYPES
// ============================================================================

export interface DashboardStats {
  totalPortfolios: number;
  totalValue: number;
  totalGainLoss: number;
  gainLossPercent: number;
  totalAssets: number;
  activeAlerts: number;
}

export interface PerformanceData {
  date: string;
  value: number;
}

export interface AssetAllocation {
  assetType: string;
  value: number;
  percentage: number;
  color: string;
}

// ============================================================================
// FORM TYPES
// ============================================================================

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
}

export interface PortfolioFormData {
  name: string;
  description: string;
  currency: string;
}

export interface AssetFormData {
  symbol: string;
  assetType: AssetType;
  quantity: number;
  avgPurchasePrice: number;
  purchaseDate: string;
}

export interface TransactionFormData {
  portfolioId: number;
  assetId: number;
  type: TransactionType;
  quantity: number;
  pricePerUnit: number;
  fees: number;
  transactionDate: string;
  notes: string;
}

export interface AlertFormData {
  assetSymbol: string;
  condition: AlertCondition;
  targetPrice: number;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type SortDirection = "asc" | "desc";

export interface SortConfig {
  key: string;
  direction: SortDirection;
}

export type ModalMode = "create" | "edit" | "view";

export interface ModalState<T> {
  isOpen: boolean;
  mode: ModalMode;
  data?: T;
}
