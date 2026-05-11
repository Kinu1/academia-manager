using AcademiaManager.Domain.ValueObjects;

namespace AcademiaManager.UnitTests.Domain;

public sealed class EmailTests
{
    [Fact]
    public void Create_NormalizesValidEmail()
    {
        var email = Email.Create(" USER@Example.COM ");

        Assert.Equal("user@example.com", email.Value);
    }

    [Fact]
    public void Create_RejectsInvalidEmail()
    {
        Assert.Throws<ArgumentException>(() => Email.Create("not-an-email"));
    }
}
