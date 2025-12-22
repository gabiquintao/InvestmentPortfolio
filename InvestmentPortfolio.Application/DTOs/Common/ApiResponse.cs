// ============================================================================
// File: InvestmentPortfolio.Application/DTOs/Common/ApiResponse.cs
// Purpose: Standardized API response wrapper for all endpoints.
// ============================================================================

using System.Runtime.Serialization;

namespace InvestmentPortfolio.Application.DTOs.Common;

/// <summary>
/// Standard API response wrapper.
/// </summary>
[DataContract]
public class ApiResponse<T>
{
	/// <summary>
	/// Indicates whether the operation was successful.
	/// </summary>
	[DataMember]
	public bool Success { get; set; }

	/// <summary>
	/// Message describing the response.
	/// </summary>
	[DataMember]
	public string Message { get; set; } = string.Empty;

	/// <summary>
	/// Data returned by the API call, if any.
	/// </summary>
	[DataMember]
	public T? Data { get; set; }

	/// <summary>
	/// List of errors encountered, if any.
	/// </summary>
	[DataMember]
	public List<string> Errors { get; set; } = new();

	/// <summary>
	/// Timestamp when the response was generated (UTC).
	/// </summary>
	[DataMember]
	public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}
