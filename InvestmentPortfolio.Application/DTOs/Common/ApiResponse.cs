// ============================================================================
// File: InvestmentPortfolio.Application/DTOs/Common/ApiResponse.cs
// ============================================================================

namespace InvestmentPortfolio.Application.DTOs.Common;

/// <summary>
/// API standard response
/// </summary>
public class ApiResponse<T>
{
	/// <summary>
	/// Indicates whether the operation was successful
	/// </summary>
	public bool Success { get; set; }

	/// <summary>
	/// Message of the response
	/// </summary>
	public string Message { get; set; } = string.Empty;

	/// <summary>
	/// Data of the response
	/// </summary>
	public T? Data { get; set; }

	/// <summary>
	/// List of errors (if they exist)
	/// </summary>
	public List<string> Errors { get; set; } = new();

	/// <summary>
	/// Timestamp of the response
	/// </summary>
	public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}