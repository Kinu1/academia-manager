using AcademiaManager.Domain.Common;

namespace AcademiaManager.Domain.Entities;

public sealed class RefreshToken : Entity
{
    private RefreshToken() { }

    private RefreshToken(Guid userId, string tokenHash, DateTime expiresAtUtc)
    {
        UserId = userId;
        TokenHash = tokenHash;
        ExpiresAtUtc = expiresAtUtc;
    }

    public Guid UserId { get; private set; }
    public string TokenHash { get; private set; } = string.Empty;
    public DateTime ExpiresAtUtc { get; private set; }
    public DateTime? RevokedAtUtc { get; private set; }
    public User User { get; private set; } = null!;

    public bool IsActive => RevokedAtUtc is null && ExpiresAtUtc > DateTime.UtcNow;

    public static RefreshToken Create(Guid userId, string tokenHash, DateTime expiresAtUtc)
    {
        if (userId == Guid.Empty)
        {
            throw new ArgumentException("User id is required.", nameof(userId));
        }

        if (string.IsNullOrWhiteSpace(tokenHash))
        {
            throw new ArgumentException("Token hash is required.", nameof(tokenHash));
        }

        if (expiresAtUtc <= DateTime.UtcNow)
        {
            throw new ArgumentOutOfRangeException(nameof(expiresAtUtc), "Refresh token must expire in the future.");
        }

        return new RefreshToken(userId, tokenHash, expiresAtUtc);
    }

    public void Revoke()
    {
        RevokedAtUtc = DateTime.UtcNow;
        MarkUpdated();
    }
}
