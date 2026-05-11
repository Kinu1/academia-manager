namespace AcademiaManager.Infrastructure.Auth;

public sealed class JwtOptions
{
    public const string SectionName = "Jwt";
    public string Issuer { get; set; } = "AcademiaManager";
    public string Audience { get; set; } = "AcademiaManager";
    public string Secret { get; set; } = string.Empty;
    public int AccessTokenMinutes { get; set; } = 30;
}
