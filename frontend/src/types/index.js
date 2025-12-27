// ============================================================================
// Investment Portfolio - TypeScript Type Definitions
// Based on backend DTOs and domain models
// ============================================================================
// ============================================================================
// ENUMS
// ============================================================================
export var AssetType;
(function (AssetType) {
    AssetType[AssetType["Stock"] = 1] = "Stock";
    AssetType[AssetType["Crypto"] = 2] = "Crypto";
})(AssetType || (AssetType = {}));
export var TransactionType;
(function (TransactionType) {
    TransactionType[TransactionType["Buy"] = 1] = "Buy";
    TransactionType[TransactionType["Sell"] = 2] = "Sell";
})(TransactionType || (TransactionType = {}));
export var AlertCondition;
(function (AlertCondition) {
    AlertCondition[AlertCondition["Above"] = 1] = "Above";
    AlertCondition[AlertCondition["Below"] = 2] = "Below";
})(AlertCondition || (AlertCondition = {}));
