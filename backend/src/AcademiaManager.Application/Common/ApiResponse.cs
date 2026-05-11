namespace AcademiaManager.Application.Common;

public sealed record ApiResponse<T>(T Data);
public sealed record ApiErrorResponse(ApiError Error);
public sealed record ApiError(string Code, string Message, IReadOnlyList<FieldError>? Details = null);
public sealed record FieldError(string Field, string Message, string Code);
