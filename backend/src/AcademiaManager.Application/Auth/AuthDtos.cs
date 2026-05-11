using AcademiaManager.Domain.Enums;

namespace AcademiaManager.Application.Auth;

public sealed record RegisterRequest(string Name, string Email, string Password, UserRole Role = UserRole.Student);
public sealed record LoginRequest(string Email, string Password);
public sealed record RefreshTokenRequest(string RefreshToken);
public sealed record AuthResponse(string AccessToken, string RefreshToken, DateTime ExpiresAtUtc, UserResponse User);
public sealed record UserResponse(Guid Id, string Name, string Email, UserRole Role);
