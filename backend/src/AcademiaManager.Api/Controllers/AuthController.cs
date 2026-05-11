using AcademiaManager.Application.Auth;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace AcademiaManager.Api.Controllers;

[Route("api/v1/auth")]
[EnableRateLimiting("auth")]
public sealed class AuthController : BaseApiController
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService) => _authService = authService;

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequest request, CancellationToken cancellationToken)
    {
        var result = await _authService.RegisterAsync(request, cancellationToken);
        if (!result.IsSuccess)
        {
            return ConflictError(result.Error!.Code, result.Error.Message);
        }

        return OkData(result.Value!);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest request, CancellationToken cancellationToken)
    {
        var result = await _authService.LoginAsync(request, cancellationToken);
        if (!result.IsSuccess)
        {
            return UnauthorizedError(result.Error!.Code, result.Error.Message);
        }

        return OkData(result.Value!);
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh(RefreshTokenRequest request, CancellationToken cancellationToken)
    {
        var result = await _authService.RefreshAsync(request, cancellationToken);
        if (!result.IsSuccess)
        {
            return UnauthorizedError(result.Error!.Code, result.Error.Message);
        }

        return OkData(result.Value!);
    }
}
