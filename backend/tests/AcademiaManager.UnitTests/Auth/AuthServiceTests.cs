using AcademiaManager.Application.Auth;
using AcademiaManager.Application.Interfaces;
using AcademiaManager.Application.Mappings;
using AcademiaManager.Domain.Entities;
using AcademiaManager.Domain.Enums;
using AcademiaManager.Infrastructure.Auth;
using AutoMapper;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;

namespace AcademiaManager.UnitTests.Auth;

public sealed class AuthServiceTests
{
    [Fact]
    public async Task RegisterAsync_ReturnsConflictWhenEmailAlreadyExists()
    {
        var repository = new FakeUserRepository(emailExists: true);
        var service = CreateService(repository);

        var result = await service.RegisterAsync(
            new RegisterRequest("Admin", "admin@example.com", "password123", UserRole.Admin),
            CancellationToken.None);

        Assert.False(result.IsSuccess);
        Assert.Equal("email_conflict", result.Error?.Code);
    }

    [Fact]
    public async Task RegisterAsync_CreatesUserAndReturnsTokens()
    {
        var repository = new FakeUserRepository(emailExists: false);
        var service = CreateService(repository);

        var result = await service.RegisterAsync(
            new RegisterRequest("Admin", "admin@example.com", "password123", UserRole.Admin),
            CancellationToken.None);

        Assert.True(result.IsSuccess);
        Assert.False(string.IsNullOrWhiteSpace(result.Value?.AccessToken));
        Assert.False(string.IsNullOrWhiteSpace(result.Value?.RefreshToken));
        Assert.Single(repository.Users);
    }

    private static AuthService CreateService(FakeUserRepository repository)
    {
        var mapper = new MapperConfiguration(
            cfg => cfg.AddProfile<AcademiaMappingProfile>(),
            NullLoggerFactory.Instance).CreateMapper();
        var hasher = new PasswordHasher();
        var tokenService = new TokenService(Options.Create(new JwtOptions
        {
            Issuer = "Tests",
            Audience = "Tests",
            Secret = "test-secret-that-is-long-enough-for-hmac",
            AccessTokenMinutes = 5
        }));

        return new AuthService(repository, hasher, tokenService, new FakeUnitOfWork(), mapper);
    }

    private sealed class FakeUserRepository : IUserRepository
    {
        private readonly bool _emailExists;

        public FakeUserRepository(bool emailExists) => _emailExists = emailExists;

        public List<User> Users { get; } = [];

        public Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken)
            => Task.FromResult(Users.FirstOrDefault(x => x.Email == email));

        public Task<User?> GetByRefreshTokenHashAsync(string tokenHash, CancellationToken cancellationToken)
            => Task.FromResult(Users.FirstOrDefault(x => x.RefreshTokens.Any(t => t.TokenHash == tokenHash)));

        public Task<bool> EmailExistsAsync(string email, CancellationToken cancellationToken)
            => Task.FromResult(_emailExists || Users.Any(x => x.Email == email));

        public Task AddAsync(User user, CancellationToken cancellationToken)
        {
            Users.Add(user);
            return Task.CompletedTask;
        }

        public Task AddRefreshTokenAsync(RefreshToken refreshToken, CancellationToken cancellationToken)
        {
            return Task.CompletedTask;
        }
    }

    private sealed class FakeUnitOfWork : IUnitOfWork
    {
        public Task<int> SaveChangesAsync(CancellationToken cancellationToken) => Task.FromResult(1);
    }
}
