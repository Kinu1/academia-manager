using AcademiaManager.Domain.Enums;

namespace AcademiaManager.Application.Academia;

public sealed record StudentResponse(
    Guid Id,
    string Name,
    string Email,
    string? Phone,
    StudentStatus Status,
    Guid? UserId,
    Guid? PlanId,
    DateTime CreatedAtUtc,
    DateTime? UpdatedAtUtc);
public sealed record CreateStudentRequest(string Name, string Email, string? Phone, Guid? PlanId);
public sealed record UpdateStudentRequest(string Name, string Email, string? Phone, StudentStatus Status, Guid? PlanId);
public sealed record ChooseStudentPlanRequest(Guid PlanId);

public sealed record PlanResponse(
    Guid Id,
    string Name,
    decimal PriceAmount,
    string PriceCurrency,
    int DurationInDays,
    bool IsActive,
    DateTime CreatedAtUtc,
    DateTime? UpdatedAtUtc);
public sealed record CreatePlanRequest(string Name, decimal PriceAmount, int DurationInDays);
public sealed record UpdatePlanRequest(string Name, decimal PriceAmount, int DurationInDays, bool IsActive);

public sealed record TrainingResponse(
    Guid Id,
    Guid StudentId,
    string Title,
    string Description,
    DateTime ScheduledForUtc,
    DateTime CreatedAtUtc,
    DateTime? UpdatedAtUtc);
public sealed record CreateTrainingRequest(Guid StudentId, string Title, string Description, DateTime ScheduledForUtc);
public sealed record UpdateTrainingRequest(string Title, string Description, DateTime ScheduledForUtc);

public sealed record PaymentResponse(
    Guid Id,
    Guid StudentId,
    decimal Amount,
    string Currency,
    DateTime DueDateUtc,
    DateTime? PaidAtUtc,
    PaymentStatus Status,
    DateTime CreatedAtUtc,
    DateTime? UpdatedAtUtc);
public sealed record CreatePaymentRequest(Guid StudentId, decimal Amount, DateTime DueDateUtc);
public sealed record UpdatePaymentRequest(decimal Amount, DateTime DueDateUtc, PaymentStatus Status);
