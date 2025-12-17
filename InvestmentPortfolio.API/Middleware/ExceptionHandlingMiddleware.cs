// ============================================================================
// File: InvestmentPortfolio.API/Services/ExceptionHandlingMiddleware.cs
// ============================================================================

using System.Net;
using Newtonsoft.Json;
using InvestmentPortfolio.Application.DTOs.Common;

namespace InvestmentPortfolio.API.Middleware;

/// <summary>
/// Middleware responsible for global exception handling.
/// </summary>
/// <remarks>
/// This middleware intercepts unhandled exceptions thrown during request processing,
/// logs the error, and returns a standardized <see cref="ApiResponse{T}"/> with an
/// appropriate HTTP status code.
/// </remarks>
public class ExceptionHandlingMiddleware
{
	private readonly RequestDelegate _next;
	private readonly ILogger<ExceptionHandlingMiddleware> _logger;

	/// <summary>
	/// Initializes a new instance of the <see cref="ExceptionHandlingMiddleware"/> class.
	/// </summary>
	/// <param name="next">The next middleware in the request pipeline.</param>
	/// <param name="logger">Logger instance.</param>
	public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
	{
		_next = next;
		_logger = logger;
	}

	/// <summary>
	/// Executes the middleware logic.
	/// </summary>
	/// <param name="context">Current HTTP context.</param>
	/// <returns>A task that represents the asynchronous operation.</returns>
	/// <exception cref="Exception">
	/// Catches any unhandled exception thrown by downstream middleware or controllers.
	/// </exception>
	public async Task InvokeAsync(HttpContext context)
	{
		try
		{
			await _next(context);
		}
		catch (Exception ex)
		{
			_logger.LogError(ex, "An unhandled exception occurred");
			await HandleExceptionAsync(context, ex);
		}
	}

	/// <summary>
	/// Handles exceptions and converts them into HTTP responses.
	/// </summary>
	/// <param name="context">Current HTTP context.</param>
	/// <param name="exception">The caught exception.</param>
	/// <returns>A task that writes the response.</returns>
	private static Task HandleExceptionAsync(HttpContext context, Exception exception)
	{
		var statusCode = HttpStatusCode.InternalServerError;
		var message = "An internal server error occurred";

		switch (exception)
		{
			case UnauthorizedAccessException:
				statusCode = HttpStatusCode.Unauthorized;
				message = exception.Message;
				break;

			case KeyNotFoundException:
				statusCode = HttpStatusCode.NotFound;
				message = exception.Message;
				break;

			case InvalidOperationException:
			case ArgumentException:
				statusCode = HttpStatusCode.BadRequest;
				message = exception.Message;
				break;
		}

		var response = new ApiResponse<object>
		{
			Success = false,
			Message = message,
			Errors = new List<string> { exception.Message }
		};

		context.Response.ContentType = "application/json";
		context.Response.StatusCode = (int)statusCode;

		return context.Response.WriteAsync(JsonConvert.SerializeObject(response));
	}
}
