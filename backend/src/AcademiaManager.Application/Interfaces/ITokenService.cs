using AcademiaManager.Domain.Entities;

namespace AcademiaManager.Application.Interfaces;

public interface ITokenService
{
    (string Token, DateTime ExpiresAtUtc) CreateAccessToken(User user);
    string CreateRefreshToken();
}
