// ============================================================================
// File: InvestmentPortfolio.Contracts/Models/ServiceResponse.cs
// Purpose: Generic wrapper for service responses, providing success status, message, data, errors, and timestamp.
// ============================================================================

using System.Runtime.Serialization;

namespace InvestmentPortfolio.Contracts.Models;

/// <summary>
/// Standard response wrapper for service operations.
/// </summary>
/// <typeparam name="T">The type of data returned in the response.</typeparam>
[DataContract(Namespace = "http://schemas.investmentportfolio.com/2025")]
public class ServiceResponse<T>
{
	/// <summary>
	/// Indicates whether the operation was successful.
	/// </summary>
	[DataMember(Order = 1)]
	public bool Success { get; set; }

	/// <summary>
	/// Message describing the result of the operation.
	/// </summary>
	[DataMember(Order = 2)]
	public string Message { get; set; } = string.Empty;

	/// <summary>
	/// Data returned by the operation. Null if the operation failed.
	/// </summary>
	[DataMember(Order = 3)]
	public T? Data { get; set; }

	/// <summary>
	/// List of errors occurred during the operation.
	/// </summary>
	[DataMember(Order = 4)]
	public List<string> Errors { get; set; } = new();

	/// <summary>
	/// Timestamp when the response was created.
	/// </summary>
	[DataMember(Order = 5)]
	public DateTime Timestamp { get; set; } = DateTime.UtcNow;

	/// <summary>
	/// Creates a successful response.
	/// </summary>
	/// <param name="data">The returned data.</param>
	/// <param name="message">Optional custom message.</param>
	/// <returns>A <see cref="ServiceResponse{T}"/> representing success.</returns>
	public static ServiceResponse<T> SuccessResponse(T data, string? message = null) =>
		new ServiceResponse<T>
		{
			Success = true,
			Message = message ?? "Operation completed successfully",
			Data = data,
			Timestamp = DateTime.UtcNow
		};

	/// <summary>
	/// Creates a failure response with optional error details.
	/// </summary>
	/// <param name="message">Error message describing the failure.</param>
	/// <param name="errors">Optional list of detailed errors.</param>
	/// <returns>A <see cref="ServiceResponse{T}"/> representing failure.</returns>
	public static ServiceResponse<T> FailureResponse(string message, List<string>? errors = null) =>
		new ServiceResponse<T>
		{
			Success = false,
			Message = message,
			Errors = errors ?? new List<string>(),
			Timestamp = DateTime.UtcNow
		};

	/// <summary>
	/// Creates a failure response from an exception.
	/// </summary>
	/// <param name="ex">Exception causing the failure.</param>
	/// <returns>A <see cref="ServiceResponse{T}"/> representing failure.</returns>
	public static ServiceResponse<T> FailureResponse(Exception ex) =>
		new ServiceResponse<T>
		{
			Success = false,
			Message = ex.Message,
			Errors = new List<string> { ex.ToString() },
			Timestamp = DateTime.UtcNow
		};
}