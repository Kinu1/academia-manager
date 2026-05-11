using AcademiaManager.Domain.Common;
using AcademiaManager.Domain.Enums;
using AcademiaManager.Domain.ValueObjects;

namespace AcademiaManager.Domain.Entities;

public sealed class Payment : Entity
{
    private Payment() { }

    private Payment(Guid studentId, Money amount, DateTime dueDateUtc)
    {
        StudentId = studentId;
        Amount = amount.Amount;
        Currency = amount.Currency;
        DueDateUtc = dueDateUtc;
        Status = PaymentStatus.Pending;
    }

    public Guid StudentId { get; private set; }
    public Student Student { get; private set; } = null!;
    public decimal Amount { get; private set; }
    public string Currency { get; private set; } = "BRL";
    public DateTime DueDateUtc { get; private set; }
    public DateTime? PaidAtUtc { get; private set; }
    public PaymentStatus Status { get; private set; }

    public static Payment Create(Guid studentId, decimal amount, DateTime dueDateUtc)
    {
        if (studentId == Guid.Empty)
        {
            throw new ArgumentException("Student id is required.", nameof(studentId));
        }

        return new Payment(studentId, Money.Create(amount), dueDateUtc);
    }

    public void Update(decimal amount, DateTime dueDateUtc, PaymentStatus status)
    {
        var money = Money.Create(amount);
        Amount = money.Amount;
        Currency = money.Currency;
        DueDateUtc = dueDateUtc;
        Status = status;
        PaidAtUtc = status == PaymentStatus.Paid ? PaidAtUtc ?? DateTime.UtcNow : null;
        MarkUpdated();
    }
}
