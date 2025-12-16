-- ============================================================================
-- File: docs/database/scripts/02_CreateTables.sql
-- ============================================================================

-- Users Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Users')
BEGIN
    CREATE TABLE Users (
        UserId INT IDENTITY(1,1) PRIMARY KEY,
        Email NVARCHAR(255) NOT NULL UNIQUE,
        PasswordHash NVARCHAR(255) NOT NULL,
        FullName NVARCHAR(255) NOT NULL,
        CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        CONSTRAINT CK_Users_Email CHECK (Email LIKE '%@%.%')
    );
    
    CREATE INDEX IX_Users_Email ON Users(Email);
END
GO

-- Portfolios Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Portfolios')
BEGIN
    CREATE TABLE Portfolios (
        PortfolioId INT IDENTITY(1,1) PRIMARY KEY,
        UserId INT NOT NULL,
        Name NVARCHAR(255) NOT NULL,
        Description NVARCHAR(1000) NULL,
        Currency NVARCHAR(3) NOT NULL DEFAULT 'EUR',
        CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        CONSTRAINT FK_Portfolios_Users FOREIGN KEY (UserId) 
            REFERENCES Users(UserId) ON DELETE CASCADE,
        CONSTRAINT CK_Portfolios_Currency CHECK (Currency IN ('EUR', 'USD', 'GBP', 'BTC'))
    );
    
    CREATE INDEX IX_Portfolios_UserId ON Portfolios(UserId);
END
GO

-- Assets Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Assets')
BEGIN
    CREATE TABLE Assets (
        AssetId INT IDENTITY(1,1) PRIMARY KEY,
        PortfolioId INT NOT NULL,
        Symbol NVARCHAR(20) NOT NULL,
        AssetType INT NOT NULL, -- 1=Stock, 2=Crypto, 3=Fund
        Quantity DECIMAL(18, 8) NOT NULL,
        AvgPurchasePrice DECIMAL(18, 8) NOT NULL,
        PurchaseDate DATETIME2 NOT NULL,
        CONSTRAINT FK_Assets_Portfolios FOREIGN KEY (PortfolioId) 
            REFERENCES Portfolios(PortfolioId) ON DELETE CASCADE,
        CONSTRAINT CK_Assets_Quantity CHECK (Quantity >= 0),
        CONSTRAINT CK_Assets_AvgPurchasePrice CHECK (AvgPurchasePrice >= 0),
        CONSTRAINT CK_Assets_AssetType CHECK (AssetType IN (1, 2, 3))
    );
    
    CREATE INDEX IX_Assets_PortfolioId ON Assets(PortfolioId);
    CREATE INDEX IX_Assets_Symbol ON Assets(Symbol);
END
GO

-- Transactions Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Transactions')
BEGIN
    CREATE TABLE Transactions (
        TransactionId INT IDENTITY(1,1) PRIMARY KEY,
        PortfolioId INT NOT NULL,
        AssetId INT NOT NULL,
        Type INT NOT NULL, -- 1=Buy, 2=Sell
        Quantity DECIMAL(18, 8) NOT NULL,
        PricePerUnit DECIMAL(18, 8) NOT NULL,
        TotalAmount DECIMAL(18, 8) NOT NULL,
        Fees DECIMAL(18, 8) NOT NULL DEFAULT 0,
        TransactionDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        Notes NVARCHAR(500) NULL,
        CONSTRAINT FK_Transactions_Portfolios FOREIGN KEY (PortfolioId) 
            REFERENCES Portfolios(PortfolioId) ON DELETE CASCADE,
        CONSTRAINT FK_Transactions_Assets FOREIGN KEY (AssetId) 
            REFERENCES Assets(AssetId),
        CONSTRAINT CK_Transactions_Type CHECK (Type IN (1, 2)),
        CONSTRAINT CK_Transactions_Quantity CHECK (Quantity > 0),
        CONSTRAINT CK_Transactions_PricePerUnit CHECK (PricePerUnit >= 0),
        CONSTRAINT CK_Transactions_Fees CHECK (Fees >= 0)
    );
    
    CREATE INDEX IX_Transactions_PortfolioId ON Transactions(PortfolioId);
    CREATE INDEX IX_Transactions_AssetId ON Transactions(AssetId);
    CREATE INDEX IX_Transactions_Date ON Transactions(TransactionDate DESC);
END
GO

-- Alerts Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Alerts')
BEGIN
    CREATE TABLE Alerts (
        AlertId INT IDENTITY(1,1) PRIMARY KEY,
        UserId INT NOT NULL,
        AssetSymbol NVARCHAR(20) NOT NULL,
        Condition INT NOT NULL, -- 1=PriceAbove, 2=PriceBelow
        TargetPrice DECIMAL(18, 8) NOT NULL,
        IsActive BIT NOT NULL DEFAULT 1,
        CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        TriggeredAt DATETIME2 NULL,
        CONSTRAINT FK_Alerts_Users FOREIGN KEY (UserId) 
            REFERENCES Users(UserId) ON DELETE CASCADE,
        CONSTRAINT CK_Alerts_Condition CHECK (Condition IN (1, 2)),
        CONSTRAINT CK_Alerts_TargetPrice CHECK (TargetPrice > 0)
    );
    
    CREATE INDEX IX_Alerts_UserId ON Alerts(UserId);
    CREATE INDEX IX_Alerts_IsActive ON Alerts(IsActive);
    CREATE INDEX IX_Alerts_AssetSymbol ON Alerts(AssetSymbol);
END
GO