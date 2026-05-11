using System.Security.Cryptography;
using System.Text;
using AcademiaManager.Application.Interfaces;
using AcademiaManager.Infrastructure.Auth;
using AcademiaManager.Infrastructure.Data;
using AcademiaManager.Infrastructure.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;

namespace AcademiaManager.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        ConfigureDatabase(services, configuration);

        var jwtOptions = BuildJwtOptions(configuration);
        services.Configure<JwtOptions>(options =>
        {
            options.Issuer = jwtOptions.Issuer;
            options.Audience = jwtOptions.Audience;
            options.Secret = jwtOptions.Secret;
            options.AccessTokenMinutes = jwtOptions.AccessTokenMinutes;
        });
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IAcademiaRepository, AcademiaRepository>();
        services.AddScoped<IUnitOfWork>(sp => sp.GetRequiredService<AppDbContext>());
        services.AddScoped<IPasswordHasher, PasswordHasher>();
        services.AddScoped<ITokenService, TokenService>();
        services.AddJwtAuthentication(jwtOptions);

        return services;
    }

    private static void ConfigureDatabase(IServiceCollection services, IConfiguration configuration)
    {
        var provider = configuration["Database:Provider"] ?? "Postgres";
        var connectionString = configuration.GetConnectionString("DefaultConnection");

        services.AddDbContext<AppDbContext>(options =>
        {
            if (provider.Equals("Sqlite", StringComparison.OrdinalIgnoreCase))
            {
                options.UseSqlite(connectionString ?? "Data Source=academia-manager-dev.db");
                return;
            }

            if (string.IsNullOrWhiteSpace(connectionString))
            {
                throw new InvalidOperationException("ConnectionStrings:DefaultConnection is required for PostgreSQL.");
            }

            options.UseNpgsql(connectionString);
        });
    }

    private static JwtOptions BuildJwtOptions(IConfiguration configuration)
    {
        var options = configuration.GetSection(JwtOptions.SectionName).Get<JwtOptions>() ?? new JwtOptions();
        if (string.IsNullOrWhiteSpace(options.Secret) || options.Secret.Length < 32)
        {
            throw new InvalidOperationException("Jwt:Secret must be configured with at least 32 characters.");
        }

        return options;
    }

    private static IServiceCollection AddJwtAuthentication(this IServiceCollection services, JwtOptions options)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(options.Secret));

        services
            .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(jwt =>
            {
                jwt.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidIssuer = options.Issuer,
                    ValidateAudience = true,
                    ValidAudience = options.Audience,
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = key,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.FromMinutes(1)
                };
            });

        return services;
    }
}
