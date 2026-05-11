using System.Net.Mail;

namespace AcademiaManager.Domain.ValueObjects;

public sealed record Email
{
    public string Value { get; }

    private Email(string value) => Value = value;

    public static Email Create(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            throw new ArgumentException("Email is required.", nameof(value));
        }

        var normalized = value.Trim().ToLowerInvariant();

        try
        {
            var address = new MailAddress(normalized);
            if (address.Address != normalized)
            {
                throw new ArgumentException("Email is invalid.", nameof(value));
            }
        }
        catch (FormatException ex)
        {
            throw new ArgumentException("Email is invalid.", nameof(value), ex);
        }

        return new Email(normalized);
    }

    public override string ToString() => Value;
}
