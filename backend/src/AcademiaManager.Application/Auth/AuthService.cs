using AcademiaManager.Application.Common;
using AcademiaManager.Application.Interfaces;
using AcademiaManager.Domain.Entities;
using AcademiaManager.Domain.Enums;
using AcademiaManager.Domain.ValueObjects;
using AutoMapper;

namespace AcademiaManager.Application.Auth;

public sealed class AuthService : IAuthService
{
    private static readonly TimeSpan RefreshTokenLifetime = TimeSpan.FromDays(14);
    private readonly IUserRepository _users;
    private readonly IAcademiaRepository _academia;
    private readonly IPasswordHasher _passwordHasher;
    private readonly ITokenService _tokenService;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public AuthService(
        IUserRepository users,
        IAcademiaRepository academia,
        IPasswordHasher passwordHasher,
        ITokenService tokenService,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _users = users;
        _academia = academia;
        _passwordHasher = passwordHasher;
        _tokenService = tokenService;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Result<AuthResponse>> RegisterAsync(RegisterRequest request, CancellationToken cancellationToken)
    {
        if (request.Role != UserRole.Student)
        {
            return Result<AuthResponse>.Failure("role_not_allowed", "Public registration is available only for students.");
        }

        var email = Email.Create(request.Email).Value;
        if (await _users.EmailExistsAsync(email, cancellationToken))
        {
            return Result<AuthResponse>.Failure("email_conflict", "Email already registered.");
        }

        var student = await _academia.GetStudentByEmailAsync(email, cancellationToken);
        if (student?.UserId is not null)
        {
            return Result<AuthResponse>.Failure("student_user_conflict", "This student profile is already linked to a user.");
        }

        var user = User.Create(request.Name, email, _passwordHasher.Hash(request.Password), UserRole.Student);
        var refreshToken = CreateRefreshToken(user);

        await _users.AddAsync(user, cancellationToken);
        if (student is null)
        {
            student = Student.Create(request.Name, email, null, user.Id);
            await _academia.AddStudentAsync(student, cancellationToken);
        }
        else
        {
            student.LinkUser(user.Id);
        }

        await _users.AddRefreshTokenAsync(refreshToken.Entity, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result<AuthResponse>.Success(CreateResponse(user, refreshToken.RawToken));
    }

    public async Task<Result<AuthResponse>> LoginAsync(LoginRequest request, CancellationToken cancellationToken)
    {
        var email = Email.Create(request.Email).Value;
        var user = await _users.GetByEmailAsync(email, cancellationToken);

        if (user is null || !_passwordHasher.Verify(request.Password, user.PasswordHash))
        {
            return Result<AuthResponse>.Failure("invalid_credentials", "Email or password is invalid.");
        }

        var refreshToken = CreateRefreshToken(user);
        await _users.AddRefreshTokenAsync(refreshToken.Entity, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result<AuthResponse>.Success(CreateResponse(user, refreshToken.RawToken));
    }

    public async Task<Result<AuthResponse>> RefreshAsync(RefreshTokenRequest request, CancellationToken cancellationToken)
    {
        var tokenHash = _passwordHasher.HashToken(request.RefreshToken);
        var user = await _users.GetByRefreshTokenHashAsync(tokenHash, cancellationToken);
        var currentToken = user?.RefreshTokens.FirstOrDefault(x => x.TokenHash == tokenHash);

        if (user is null || currentToken is null || !currentToken.IsActive)
        {
            return Result<AuthResponse>.Failure("invalid_refresh_token", "Refresh token is invalid or expired.");
        }

        currentToken.Revoke();
        var refreshToken = CreateRefreshToken(user);
        await _users.AddRefreshTokenAsync(refreshToken.Entity, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result<AuthResponse>.Success(CreateResponse(user, refreshToken.RawToken));
    }

    private (string RawToken, RefreshToken Entity) CreateRefreshToken(User user)
    {
        var refreshToken = _tokenService.CreateRefreshToken();
        var entity = RefreshToken.Create(user.Id, _passwordHasher.HashToken(refreshToken), DateTime.UtcNow.Add(RefreshTokenLifetime));
        return (refreshToken, entity);
    }

    private AuthResponse CreateResponse(User user, string refreshToken)
    {
        var (accessToken, expiresAtUtc) = _tokenService.CreateAccessToken(user);
        return new AuthResponse(accessToken, refreshToken, expiresAtUtc, _mapper.Map<UserResponse>(user));
    }
}
