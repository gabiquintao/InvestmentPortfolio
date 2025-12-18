// ============================================================================
// File: InvestmentPortfolio.WCF/DataContracts/UserDataContract.cs
// ============================================================================

using System.Runtime.Serialization;

namespace InvestmentPortfolio.WCF.DataContracts
{
	/// <summary>
	/// Data contract that represents a user entity.
	/// This contract is used by WCF services to transfer user-related data
	/// between the service layer and its consumers.
	/// </summary>
	[DataContract]
	public class UserDataContract
	{
		/// <summary>
		/// Gets or sets the unique identifier of the user.
		/// </summary>
		[DataMember]
		public int UserId { get; set; }

		/// <summary>
		/// Gets or sets the email address of the user.
		/// </summary>
		[DataMember]
		public string Email { get; set; } = string.Empty;

		/// <summary>
		/// Gets or sets the hashed password of the user.
		/// This value should never contain the plain text password.
		/// </summary>
		[DataMember]
		public string PasswordHash { get; set; } = string.Empty;

		/// <summary>
		/// Gets or sets the full name of the user.
		/// </summary>
		[DataMember]
		public string FullName { get; set; } = string.Empty;

		/// <summary>
		/// Gets or sets the date and time when the user was created.
		/// </summary>
		[DataMember]
		public DateTime CreatedAt { get; set; }
	}
}
