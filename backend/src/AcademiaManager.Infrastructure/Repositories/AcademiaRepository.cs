using AcademiaManager.Application.Interfaces;
using AcademiaManager.Domain.Entities;
using AcademiaManager.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace AcademiaManager.Infrastructure.Repositories;

public sealed class AcademiaRepository : IAcademiaRepository
{
    private readonly AppDbContext _db;

    public AcademiaRepository(AppDbContext db) => _db = db;

    public async Task<(IReadOnlyList<Student> Items, int Total)> ListStudentsAsync(int page, int perPage, CancellationToken cancellationToken)
        => await PageAsync(_db.Students.AsNoTracking().OrderBy(x => x.Name), page, perPage, cancellationToken);

    public Task<Student?> GetStudentAsync(Guid id, CancellationToken cancellationToken)
        => _db.Students.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

    public Task<Student?> GetStudentByEmailAsync(string email, CancellationToken cancellationToken)
        => _db.Students.FirstOrDefaultAsync(x => x.Email == email, cancellationToken);

    public Task<Student?> GetStudentByUserIdAsync(Guid userId, CancellationToken cancellationToken)
        => _db.Students.FirstOrDefaultAsync(x => x.UserId == userId, cancellationToken);

    public async Task AddStudentAsync(Student student, CancellationToken cancellationToken)
        => await _db.Students.AddAsync(student, cancellationToken);

    public void RemoveStudent(Student student) => _db.Students.Remove(student);

    public async Task<(IReadOnlyList<Plan> Items, int Total)> ListPlansAsync(int page, int perPage, CancellationToken cancellationToken)
        => await PageAsync(_db.Plans.AsNoTracking().OrderBy(x => x.Name), page, perPage, cancellationToken);

    public Task<Plan?> GetPlanAsync(Guid id, CancellationToken cancellationToken)
        => _db.Plans.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

    public async Task AddPlanAsync(Plan plan, CancellationToken cancellationToken)
        => await _db.Plans.AddAsync(plan, cancellationToken);

    public void RemovePlan(Plan plan) => _db.Plans.Remove(plan);

    public async Task<(IReadOnlyList<Training> Items, int Total)> ListTrainingsAsync(int page, int perPage, CancellationToken cancellationToken)
        => await PageAsync(_db.Trainings.AsNoTracking().OrderByDescending(x => x.ScheduledForUtc), page, perPage, cancellationToken);

    public Task<Training?> GetTrainingAsync(Guid id, CancellationToken cancellationToken)
        => _db.Trainings.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

    public async Task AddTrainingAsync(Training training, CancellationToken cancellationToken)
        => await _db.Trainings.AddAsync(training, cancellationToken);

    public void RemoveTraining(Training training) => _db.Trainings.Remove(training);

    public async Task<(IReadOnlyList<Payment> Items, int Total)> ListPaymentsAsync(int page, int perPage, CancellationToken cancellationToken)
        => await PageAsync(_db.Payments.AsNoTracking().OrderByDescending(x => x.DueDateUtc), page, perPage, cancellationToken);

    public async Task<(IReadOnlyList<Payment> Items, int Total)> ListPaymentsByStudentIdAsync(Guid studentId, int page, int perPage, CancellationToken cancellationToken)
        => await PageAsync(_db.Payments.AsNoTracking().Where(x => x.StudentId == studentId).OrderByDescending(x => x.DueDateUtc), page, perPage, cancellationToken);

    public Task<Payment?> GetPaymentAsync(Guid id, CancellationToken cancellationToken)
        => _db.Payments.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

    public async Task AddPaymentAsync(Payment payment, CancellationToken cancellationToken)
        => await _db.Payments.AddAsync(payment, cancellationToken);

    public void RemovePayment(Payment payment) => _db.Payments.Remove(payment);

    private static async Task<(IReadOnlyList<T> Items, int Total)> PageAsync<T>(
        IQueryable<T> query,
        int page,
        int perPage,
        CancellationToken cancellationToken)
    {
        var total = await query.CountAsync(cancellationToken);
        var items = await query.Skip((page - 1) * perPage).Take(perPage).ToListAsync(cancellationToken);
        return (items, total);
    }
}
