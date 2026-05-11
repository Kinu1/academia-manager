using AcademiaManager.Application.Academia;
using AcademiaManager.Application.Auth;
using Microsoft.Extensions.DependencyInjection;

namespace AcademiaManager.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IAcademiaService, AcademiaService>();
        return services;
    }
}
