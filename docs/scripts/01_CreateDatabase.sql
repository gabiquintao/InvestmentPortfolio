-- ============================================================================
-- Investment Portfolio Monitoring System - Database Creation Script
-- ============================================================================
-- File: docs/database/scripts/01_CreateDatabase.sql
-- ============================================================================

-- Create database
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'InvestmentPortfolioDB')
BEGIN
    CREATE DATABASE InvestmentPortfolioDB;
END
GO

USE InvestmentPortfolioDB;
GO