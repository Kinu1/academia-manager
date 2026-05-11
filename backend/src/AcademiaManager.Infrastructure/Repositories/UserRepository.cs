using AcademiaManager.Application.Interfaces;
using AcademiaManager.Domain.Entities;
using AcademiaManager.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace AcademiaManager.Infrastructure.Repositories;

public sealed class UserRepository : IUserRepository
{
    private readonly AppDbContext _db;

    public UserRepository(AppDbContext db) => _db = db;

    public Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken)
        => _db.Users.Include(x => x.RefreshTokens).FirstOrDefaultAsync(x => x.Email == email, cancellationToken);

    public Task<User?> GetByRefreshTokenHashAsync(string tokenHash, CancellationToken cancellationToken)
        => _db.Users.Include(x => x.RefreshTokens).FirstOrDefaultAsync(
            x => x.RefreshTokens.Any(token => token.TokenHash == tokenHash),
            cancellationToken);

    public Task<bool> EmailExistsAsync(string email, CancellationToken cancellationToken)
        => _db.Users.AnyAsync(x => x.Email == email, cancellationToken);

    public async Task AddAsync(User user, CancellationToken cancellationToken)
        => await _db.Users.AddAsync(user, cancellationToken);

    public async Task AddRefreshTokenAsync(RefreshToken refreshToken, CancellationToken cancellationToken)
        => await _db.RefreshTokens.AddAsync(refreshToken, cancellationToken);
}
