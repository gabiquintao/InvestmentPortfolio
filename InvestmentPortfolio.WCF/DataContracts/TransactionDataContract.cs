// ============================================================================
// File: InvestmentPortfolio.WCF/DataContracts/TransactionDataContract.cs
// ============================================================================

using System.Runtime.Serialization;

namespace InvestmentPortfolio.WCF.DataContracts
{
	/// <summary>
	/// Data contract that represents a financial transaction within a portfolio.
	/// This contract is used by WCF services to transfer transaction data
	/// between the service layer and its consumers.
	/// </summary>
	[DataContract]
	public class TransactionDataContract
	{
		/// <summary>
		/// Gets or sets the unique identifier of the transaction.
		/// </summary>
		[DataMember]
		public int TransactionId { get; set; }

		/// <summary>
		/// Gets or sets the identifier of the portfolio associated with the transaction.
		/// </summary>
		[DataMember]
		public int PortfolioId { get; set; }

		/// <summary>
		/// Gets or sets the identifier of the asset involved in the transaction.
		/// </summary>
		[DataMember]
		public int AssetId { get; set; }

		/// <summary>
		/// Gets or sets the transaction type (e.g., buy or sell).
		/// </summary>
		[DataMember]
		public int Type { get; set; }

		/// <summary>
		/// Gets or sets the quantity of the asset transacted.
		/// </summary>
		[DataMember]
		public decimal Quantity { get; set; }

		/// <summary>
		/// Gets or sets the price per unit of the asset at the time of the transaction.
		/// </summary>
		[DataMember]
		public decimal PricePerUnit { get; set; }

		/// <summary>
		/// Gets or sets the total monetary amount of the transaction.
		/// </summary>
		[DataMember]
		public decimal TotalAmount { get; set; }

		/// <summary>
		/// Gets or sets any fees associated with the transaction.
		/// </summary>
		[DataMember]
		public decimal Fees { get; set; }

		/// <summary>
		/// Gets or sets the date and time when the transaction occurred.
		/// </summary>
		[DataMember]
		public DateTime TransactionDate { get; set; }

		/// <summary>
		/// Gets or sets optional notes or comments related to the transaction.
		/// </summary>
		[DataMember]
		public string Notes { get; set; } = string.Empty;

		/// <summary>
		/// Gets or sets the symbol of the asset associated with the transaction.
		/// </summary>
		[DataMember]
		public string AssetSymbol { get; set; } = string.Empty;
	}
}
