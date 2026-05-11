namespace AcademiaManager.Application.Interfaces;

public interface IPasswordHasher
{
    string Hash(string password);
    bool Verify(string password, string passwordHash);
    string HashToken(string token);
}
