using AcademiaManager.Domain.Common;
using AcademiaManager.Domain.Enums;
using EmailValue = AcademiaManager.Domain.ValueObjects.Email;

namespace AcademiaManager.Domain.Entities;

public sealed class Student : Entity
{
    private Student() { }

    private Student(string name, EmailValue email, string? phone)
    {
        Name = name;
        Email = email.Value;
        Phone = phone;
        Status = StudentStatus.Active;
    }

    public string Name { get; private set; } = string.Empty;
    public string Email { get; private set; } = string.Empty;
    public string? Phone { get; private set; }
    public StudentStatus Status { get; private set; }
    public Guid? PlanId { get; private set; }
    public Plan? Plan { get; private set; }

    public static Student Create(string name, string email, string? phone)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            throw new ArgumentException("Name is required.", nameof(name));
        }

        return new Student(name.Trim(), EmailValue.Create(email), NormalizePhone(phone));
    }

    public void Update(string name, string email, string? phone, StudentStatus status, Guid? planId)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            throw new ArgumentException("Name is required.", nameof(name));
        }

        Name = name.Trim();
        Email = EmailValue.Create(email).Value;
        Phone = NormalizePhone(phone);
        Status = status;
        PlanId = planId;
        MarkUpdated();
    }

    private static string? NormalizePhone(string? phone)
        => string.IsNullOrWhiteSpace(phone) ? null : phone.Trim();
}
