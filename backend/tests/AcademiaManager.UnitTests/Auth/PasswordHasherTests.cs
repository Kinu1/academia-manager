using AcademiaManager.Infrastructure.Auth;

namespace AcademiaManager.UnitTests.Auth;

public sealed class PasswordHasherTests
{
    [Fact]
    public void Verify_ReturnsTrueForMatchingPassword()
    {
        var hasher = new PasswordHasher();

        var hash = hasher.Hash("S3cure-password");

        Assert.True(hasher.Verify("S3cure-password", hash));
        Assert.False(hasher.Verify("wrong-password", hash));
    }

    [Fact]
    public void HashToken_IsDeterministicAndDoesNotReturnRawToken()
    {
        var hasher = new PasswordHasher();

        var hash = hasher.HashToken("refresh-token");

        Assert.Equal(hash, hasher.HashToken("refresh-token"));
        Assert.NotEqual("refresh-token", hash);
    }
}
