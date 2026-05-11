using AcademiaManager.Domain.Common;
using AcademiaManager.Domain.ValueObjects;

namespace AcademiaManager.Domain.Entities;

public sealed class Plan : Entity
{
    private Plan() { }

    private Plan(string name, Money price, int durationInDays)
    {
        Name = name;
        PriceAmount = price.Amount;
        PriceCurrency = price.Currency;
        DurationInDays = durationInDays;
        IsActive = true;
    }

    public string Name { get; private set; } = string.Empty;
    public decimal PriceAmount { get; private set; }
    public string PriceCurrency { get; private set; } = "BRL";
    public int DurationInDays { get; private set; }
    public bool IsActive { get; private set; }

    public static Plan Create(string name, decimal priceAmount, int durationInDays)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            throw new ArgumentException("Name is required.", nameof(name));
        }

        if (durationInDays <= 0)
        {
            throw new ArgumentOutOfRangeException(nameof(durationInDays), "Duration must be positive.");
        }

        return new Plan(name.Trim(), Money.Create(priceAmount), durationInDays);
    }

    public void Update(string name, decimal priceAmount, int durationInDays, bool isActive)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            throw new ArgumentException("Name is required.", nameof(name));
        }

        if (durationInDays <= 0)
        {
            throw new ArgumentOutOfRangeException(nameof(durationInDays), "Duration must be positive.");
        }

        var price = Money.Create(priceAmount);
        Name = name.Trim();
        PriceAmount = price.Amount;
        PriceCurrency = price.Currency;
        DurationInDays = durationInDays;
        IsActive = isActive;
        MarkUpdated();
    }
}
