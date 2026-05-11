using AcademiaManager.Domain.Entities;

namespace AcademiaManager.Application.Interfaces;

public interface IAcademiaRepository
{
    Task<(IReadOnlyList<Student> Items, int Total)> ListStudentsAsync(int page, int perPage, CancellationToken cancellationToken);
    Task<Student?> GetStudentAsync(Guid id, CancellationToken cancellationToken);
    Task AddStudentAsync(Student student, CancellationToken cancellationToken);
    void RemoveStudent(Student student);

    Task<(IReadOnlyList<Plan> Items, int Total)> ListPlansAsync(int page, int perPage, CancellationToken cancellationToken);
    Task<Plan?> GetPlanAsync(Guid id, CancellationToken cancellationToken);
    Task AddPlanAsync(Plan plan, CancellationToken cancellationToken);
    void RemovePlan(Plan plan);

    Task<(IReadOnlyList<Training> Items, int Total)> ListTrainingsAsync(int page, int perPage, CancellationToken cancellationToken);
    Task<Training?> GetTrainingAsync(Guid id, CancellationToken cancellationToken);
    Task AddTrainingAsync(Training training, CancellationToken cancellationToken);
    void RemoveTraining(Training training);

    Task<(IReadOnlyList<Payment> Items, int Total)> ListPaymentsAsync(int page, int perPage, CancellationToken cancellationToken);
    Task<Payment?> GetPaymentAsync(Guid id, CancellationToken cancellationToken);
    Task AddPaymentAsync(Payment payment, CancellationToken cancellationToken);
    void RemovePayment(Payment payment);
}
