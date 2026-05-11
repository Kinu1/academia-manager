using AcademiaManager.Domain.ValueObjects;

namespace AcademiaManager.UnitTests.Domain;

public sealed class MoneyTests
{
    [Fact]
    public void Create_RoundsAmountAndNormalizesCurrency()
    {
        var money = Money.Create(99.999m, "brl");

        Assert.Equal(100.00m, money.Amount);
        Assert.Equal("BRL", money.Currency);
    }

    [Fact]
    public void Create_RejectsNegativeAmount()
    {
        Assert.Throws<ArgumentOutOfRangeException>(() => Money.Create(-1));
    }
}
