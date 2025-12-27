// ============================================================================
// File: InvestmentPortfolio.Application/Mappings/MappingProfile.cs
// ============================================================================
using AutoMapper;
using InvestmentPortfolio.Application.DTOs.Alerts;
using InvestmentPortfolio.Application.DTOs.Assets;
using InvestmentPortfolio.Application.DTOs.Auth;
using InvestmentPortfolio.Application.DTOs.Portfolios;
using InvestmentPortfolio.Application.DTOs.Transactions;
using InvestmentPortfolio.Application.DTOs.Users;
using InvestmentPortfolio.Domain.Entities;
using InvestmentPortfolio.Domain.Enums;

namespace InvestmentPortfolio.Application.Mappings;

public class MappingProfile : Profile
{
	public MappingProfile()
	{
		// -------------------------
		// User mappings
		// -------------------------
		CreateMap<User, UserDto>();
		CreateMap<RegisterRequestDto, User>()
			.ForMember(dest => dest.UserId, opt => opt.Ignore())
			.ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(_ => DateTime.UtcNow))
			.ForMember(dest => dest.Portfolios, opt => opt.Ignore())
			.ForMember(dest => dest.Alerts, opt => opt.Ignore());

		// -------------------------
		// Portfolio mappings
		// -------------------------
		CreateMap<Portfolio, PortfolioDto>();
		CreateMap<CreatePortfolioDto, Portfolio>()
			.ForMember(dest => dest.PortfolioId, opt => opt.Ignore())
			.ForMember(dest => dest.UserId, opt => opt.Ignore())
			.ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(_ => DateTime.UtcNow))
			.ForMember(dest => dest.User, opt => opt.Ignore())
			.ForMember(dest => dest.Assets, opt => opt.Ignore())
			.ForMember(dest => dest.Transactions, opt => opt.Ignore());

		CreateMap<UpdatePortfolioDto, Portfolio>()
			.ForMember(dest => dest.PortfolioId, opt => opt.Ignore())
			.ForMember(dest => dest.UserId, opt => opt.Ignore())
			.ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
			.ForMember(dest => dest.User, opt => opt.Ignore())
			.ForMember(dest => dest.Assets, opt => opt.Ignore())
			.ForMember(dest => dest.Transactions, opt => opt.Ignore());

		// -------------------------
		// Asset mappings
		// -------------------------
		CreateMap<Asset, AssetDto>()
			.ForMember(dest => dest.AssetTypeName, opt => opt.MapFrom(src => GetAssetTypeName(src.AssetType)))
			.ForMember(dest => dest.CurrentValue, opt => opt.MapFrom(src => src.Quantity * src.AvgPurchasePrice))
			.AfterMap((src, dest) =>
			{
				// ✅ ADICIONADO: Calcula GainLoss após o mapping
				// Inicialmente CurrentValue = Quantity * AvgPurchasePrice (custo base)
				// GainLoss será 0 até ser atualizado com dados de mercado
				dest.GainLoss = dest.CurrentValue - (dest.Quantity * dest.AvgPurchasePrice);
			});

		CreateMap<CreateAssetDto, Asset>()
			.ForMember(dest => dest.AssetId, opt => opt.Ignore())
			.ForMember(dest => dest.PortfolioId, opt => opt.Ignore())
			.ForMember(dest => dest.Portfolio, opt => opt.Ignore())
			.ForMember(dest => dest.Transactions, opt => opt.Ignore())
			.ForMember(dest => dest.AssetType, opt => opt.MapFrom(src => (AssetType)src.AssetType));

		CreateMap<UpdateAssetDto, Asset>()
			.ForMember(dest => dest.AssetId, opt => opt.Ignore())
			.ForMember(dest => dest.PortfolioId, opt => opt.Ignore())
			.ForMember(dest => dest.Symbol, opt => opt.Ignore())
			.ForMember(dest => dest.AssetType, opt => opt.Ignore())
			.ForMember(dest => dest.PurchaseDate, opt => opt.Ignore())
			.ForMember(dest => dest.Portfolio, opt => opt.Ignore())
			.ForMember(dest => dest.Transactions, opt => opt.Ignore());

		// -------------------------
		// Transaction mappings
		// -------------------------
		CreateMap<Transaction, TransactionDto>()
			.ForMember(dest => dest.AssetSymbol, opt => opt.MapFrom(src => src.Asset != null ? src.Asset.Symbol : string.Empty))
			.ForMember(dest => dest.TypeName, opt => opt.MapFrom(src => GetTransactionTypeName(src.Type)));

		CreateMap<CreateTransactionDto, Transaction>()
			.ForMember(dest => dest.TransactionId, opt => opt.Ignore())
			.ForMember(dest => dest.TotalAmount, opt => opt.MapFrom(src => src.Quantity * src.PricePerUnit + src.Fees))
			.ForMember(dest => dest.Portfolio, opt => opt.Ignore())
			.ForMember(dest => dest.Asset, opt => opt.Ignore())
			.ForMember(dest => dest.Type, opt => opt.MapFrom(src => (TransactionType)src.Type));

		// -------------------------
		// Alert mappings
		// -------------------------
		CreateMap<Alert, AlertDto>()
			.ForMember(dest => dest.ConditionName, opt => opt.MapFrom(src => GetAlertConditionName(src.Condition)));

		CreateMap<CreateAlertDto, Alert>()
			.ForMember(dest => dest.AlertId, opt => opt.Ignore())
			.ForMember(dest => dest.UserId, opt => opt.Ignore())
			.ForMember(dest => dest.IsActive, opt => opt.MapFrom(_ => true))
			.ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(_ => DateTime.UtcNow))
			.ForMember(dest => dest.TriggeredAt, opt => opt.Ignore())
			.ForMember(dest => dest.User, opt => opt.Ignore())
			.ForMember(dest => dest.Condition, opt => opt.MapFrom(src => (AlertCondition)src.Condition));

		CreateMap<UpdateAlertDto, Alert>()
			.ForMember(dest => dest.AlertId, opt => opt.Ignore())
			.ForMember(dest => dest.UserId, opt => opt.Ignore())
			.ForMember(dest => dest.AssetSymbol, opt => opt.Ignore())
			.ForMember(dest => dest.Condition, opt => opt.Ignore())
			.ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
			.ForMember(dest => dest.TriggeredAt, opt => opt.Ignore())
			.ForMember(dest => dest.User, opt => opt.Ignore());
	}

	#region Helper Methods

	private static string GetAssetTypeName(AssetType assetType)
	{
		return assetType switch
		{
			AssetType.Stock => "Stock",
			AssetType.Crypto => "Crypto",
			AssetType.Fund => "Fund",
			_ => "Unknown"
		};
	}

	private static string GetTransactionTypeName(TransactionType transactionType)
	{
		return transactionType switch
		{
			TransactionType.Buy => "Buy",
			TransactionType.Sell => "Sell",
			_ => "Unknown"
		};
	}

	private static string GetAlertConditionName(AlertCondition condition)
	{
		return condition switch
		{
			AlertCondition.PriceAbove => "Price Above",
			AlertCondition.PriceBelow => "Price Below",
			_ => "Unknown"
		};
	}

	#endregion
}