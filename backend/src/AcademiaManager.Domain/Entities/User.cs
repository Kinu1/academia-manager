using AcademiaManager.Domain.Common;
using AcademiaManager.Domain.Enums;
using EmailValue = AcademiaManager.Domain.ValueObjects.Email;

namespace AcademiaManager.Domain.Entities;

public sealed class User : Entity
{
    private readonly List<RefreshToken> _refreshTokens = [];

    private User() { }

    private User(string name, EmailValue email, string passwordHash, UserRole role)
    {
        Name = name;
        Email = email.Value;
        PasswordHash = passwordHash;
        Role = role;
    }

    public string Name { get; private set; } = string.Empty;
    public string Email { get; private set; } = string.Empty;
    public string PasswordHash { get; private set; } = string.Empty;
    public UserRole Role { get; private set; } = UserRole.Student;
    public IReadOnlyCollection<RefreshToken> RefreshTokens => _refreshTokens;

    public static User Create(string name, string email, string passwordHash, UserRole role)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            throw new ArgumentException("Name is required.", nameof(name));
        }

        if (string.IsNullOrWhiteSpace(passwordHash))
        {
            throw new ArgumentException("Password hash is required.", nameof(passwordHash));
        }

        return new User(name.Trim(), EmailValue.Create(email), passwordHash, role);
    }

    public RefreshToken AddRefreshToken(string tokenHash, DateTime expiresAtUtc)
    {
        var token = RefreshToken.Create(Id, tokenHash, expiresAtUtc);
        _refreshTokens.Add(token);
        return token;
    }
}
