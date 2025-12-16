-- ============================================================================
-- File: docs/database/scripts/03_SeedData.sql
-- ============================================================================

-- Test user
INSERT INTO Users (Email, PasswordHash, FullName, CreatedAt)
VALUES 
    ('test@example.com', '$2a$11$ExampleHashPasswordHere', 'Test User', GETUTCDATE());

-- Test portfolio
DECLARE @TestUserId INT = (SELECT UserId FROM Users WHERE Email = 'test@example.com');

INSERT INTO Portfolios (UserId, Name, Description, Currency, CreatedAt)
VALUES 
    (@TestUserId, 'My First Portfolio', 'Portfolio de investimentos diversificado', 'EUR', GETUTCDATE());

-- Test asset
DECLARE @TestPortfolioId INT = (SELECT TOP 1 PortfolioId FROM Portfolios WHERE UserId = @TestUserId);

INSERT INTO Assets (PortfolioId, Symbol, AssetType, Quantity, AvgPurchasePrice, PurchaseDate)
VALUES 
    (@TestPortfolioId, 'AAPL', 1, 10.00000000, 150.50000000, GETUTCDATE()),
    (@TestPortfolioId, 'BTC-USD', 2, 0.50000000, 35000.00000000, GETUTCDATE());

-- Test transaction
DECLARE @TestAssetId INT = (SELECT TOP 1 AssetId FROM Assets WHERE PortfolioId = @TestPortfolioId);

INSERT INTO Transactions (PortfolioId, AssetId, Type, Quantity, PricePerUnit, TotalAmount, Fees, TransactionDate, Notes)
VALUES 
    (@TestPortfolioId, @TestAssetId, 1, 10.00000000, 150.50000000, 1505.00000000, 5.00000000, GETUTCDATE(), 'Initial purchase');

-- Test alert
INSERT INTO Alerts (UserId, AssetSymbol, Condition, TargetPrice, IsActive, CreatedAt)
VALUES 
    (@TestUserId, 'AAPL', 1, 200.00000000, 1, GETUTCDATE());

GO

PRINT 'Database created and seeded successfully!';
GO