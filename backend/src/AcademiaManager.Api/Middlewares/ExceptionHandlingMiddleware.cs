using System.Net;
using AcademiaManager.Application.Common;
using Microsoft.EntityFrameworkCore;

namespace AcademiaManager.Api.Middlewares;

public sealed class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (ArgumentException ex)
        {
            await WriteErrorAsync(context, HttpStatusCode.UnprocessableEntity, "validation_error", ex.Message);
        }
        catch (DbUpdateException ex)
        {
            _logger.LogWarning(ex, "Database update failed");
            await WriteErrorAsync(context, HttpStatusCode.Conflict, "data_conflict", "Request conflicts with existing data.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled request failure");
            await WriteErrorAsync(context, HttpStatusCode.InternalServerError, "internal_error", "Unexpected server error.");
        }
    }

    private static async Task WriteErrorAsync(HttpContext context, HttpStatusCode status, string code, string message)
    {
        context.Response.StatusCode = (int)status;
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsJsonAsync(new ApiErrorResponse(new ApiError(code, message)));
    }
}
