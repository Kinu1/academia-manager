using AcademiaManager.Application.Common;
using AcademiaManager.Application.Interfaces;
using AcademiaManager.Domain.Entities;
using AcademiaManager.Domain.Enums;
using AutoMapper;

namespace AcademiaManager.Application.Academia;

public sealed class AcademiaService : IAcademiaService
{
    private readonly IAcademiaRepository _repository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public AcademiaService(IAcademiaRepository repository, IUnitOfWork unitOfWork, IMapper mapper)
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<PagedResult<StudentResponse>> ListStudentsAsync(int page, int perPage, CancellationToken cancellationToken)
    {
        var (items, total) = await _repository.ListStudentsAsync(NormalizePage(page), NormalizePerPage(perPage), cancellationToken);
        return Page(items.Select(_mapper.Map<StudentResponse>).ToList(), page, perPage, total);
    }

    public async Task<StudentResponse?> GetStudentAsync(Guid id, CancellationToken cancellationToken)
        => _mapper.Map<StudentResponse?>(await _repository.GetStudentAsync(id, cancellationToken));

    public async Task<StudentResponse?> GetStudentByUserIdAsync(Guid userId, CancellationToken cancellationToken)
        => _mapper.Map<StudentResponse?>(await _repository.GetStudentByUserIdAsync(userId, cancellationToken));

    public async Task<StudentResponse> CreateStudentAsync(CreateStudentRequest request, CancellationToken cancellationToken)
    {
        var student = Student.Create(request.Name, request.Email, request.Phone);
        student.Update(request.Name, request.Email, request.Phone, student.Status, request.PlanId);
        await _repository.AddStudentAsync(student, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return _mapper.Map<StudentResponse>(student);
    }

    public async Task<StudentResponse?> UpdateStudentAsync(Guid id, UpdateStudentRequest request, CancellationToken cancellationToken)
    {
        var student = await _repository.GetStudentAsync(id, cancellationToken);
        if (student is null) return null;
        student.Update(request.Name, request.Email, request.Phone, request.Status, request.PlanId);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return _mapper.Map<StudentResponse>(student);
    }

    public async Task<Result<StudentResponse>> ChooseCurrentStudentPlanAsync(Guid userId, ChooseStudentPlanRequest request, CancellationToken cancellationToken)
    {
        var student = await _repository.GetStudentByUserIdAsync(userId, cancellationToken);
        if (student is null)
        {
            return Result<StudentResponse>.Failure("student_profile_not_found", "Student profile was not found for the current user.");
        }

        var plan = await _repository.GetPlanAsync(request.PlanId, cancellationToken);
        if (plan is null)
        {
            return Result<StudentResponse>.Failure("plan_not_found", "Plan not found.");
        }

        if (!plan.IsActive)
        {
            return Result<StudentResponse>.Failure("plan_inactive", "Only active plans can be selected.");
        }

        if (student.PlanId == request.PlanId)
        {
            return Result<StudentResponse>.Failure("plan_already_selected", "This plan is already selected.");
        }

        student.ChoosePlan(request.PlanId);
        var (payments, _) = await _repository.ListPaymentsByStudentIdAsync(student.Id, 1, 100, cancellationToken);
        var hasUnpaidChargeForPlan = payments.Any(payment =>
            payment.Status is PaymentStatus.Pending or PaymentStatus.Overdue
            && payment.Amount == plan.PriceAmount
            && payment.Currency == plan.PriceCurrency);
        var hasPaidChargeForPlan = payments.Any(payment =>
            payment.Status == PaymentStatus.Paid
            && payment.Amount == plan.PriceAmount
            && payment.Currency == plan.PriceCurrency);

        if (!hasUnpaidChargeForPlan && !hasPaidChargeForPlan)
        {
            var payment = Payment.Create(student.Id, plan.PriceAmount, DateTime.UtcNow);
            await _repository.AddPaymentAsync(payment, cancellationToken);
        }

        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return Result<StudentResponse>.Success(_mapper.Map<StudentResponse>(student));
    }

    public async Task<bool> DeleteStudentAsync(Guid id, CancellationToken cancellationToken)
    {
        var student = await _repository.GetStudentAsync(id, cancellationToken);
        if (student is null) return false;
        _repository.RemoveStudent(student);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return true;
    }

    public async Task<PagedResult<PlanResponse>> ListPlansAsync(int page, int perPage, CancellationToken cancellationToken)
    {
        var (items, total) = await _repository.ListPlansAsync(NormalizePage(page), NormalizePerPage(perPage), cancellationToken);
        return Page(items.Select(_mapper.Map<PlanResponse>).ToList(), page, perPage, total);
    }

    public async Task<PlanResponse?> GetPlanAsync(Guid id, CancellationToken cancellationToken)
        => _mapper.Map<PlanResponse?>(await _repository.GetPlanAsync(id, cancellationToken));

    public async Task<PlanResponse> CreatePlanAsync(CreatePlanRequest request, CancellationToken cancellationToken)
    {
        var plan = Plan.Create(request.Name, request.PriceAmount, request.DurationInDays);
        await _repository.AddPlanAsync(plan, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return _mapper.Map<PlanResponse>(plan);
    }

    public async Task<PlanResponse?> UpdatePlanAsync(Guid id, UpdatePlanRequest request, CancellationToken cancellationToken)
    {
        var plan = await _repository.GetPlanAsync(id, cancellationToken);
        if (plan is null) return null;
        plan.Update(request.Name, request.PriceAmount, request.DurationInDays, request.IsActive);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return _mapper.Map<PlanResponse>(plan);
    }

    public async Task<bool> DeletePlanAsync(Guid id, CancellationToken cancellationToken)
    {
        var plan = await _repository.GetPlanAsync(id, cancellationToken);
        if (plan is null) return false;
        _repository.RemovePlan(plan);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return true;
    }

    public async Task<PagedResult<TrainingResponse>> ListTrainingsAsync(int page, int perPage, CancellationToken cancellationToken)
    {
        var (items, total) = await _repository.ListTrainingsAsync(NormalizePage(page), NormalizePerPage(perPage), cancellationToken);
        return Page(items.Select(_mapper.Map<TrainingResponse>).ToList(), page, perPage, total);
    }

    public async Task<TrainingResponse?> GetTrainingAsync(Guid id, CancellationToken cancellationToken)
        => _mapper.Map<TrainingResponse?>(await _repository.GetTrainingAsync(id, cancellationToken));

    public async Task<TrainingResponse> CreateTrainingAsync(CreateTrainingRequest request, CancellationToken cancellationToken)
    {
        var training = Training.Create(request.StudentId, request.Title, request.Description, request.ScheduledForUtc);
        await _repository.AddTrainingAsync(training, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return _mapper.Map<TrainingResponse>(training);
    }

    public async Task<TrainingResponse?> UpdateTrainingAsync(Guid id, UpdateTrainingRequest request, CancellationToken cancellationToken)
    {
        var training = await _repository.GetTrainingAsync(id, cancellationToken);
        if (training is null) return null;
        training.Update(request.Title, request.Description, request.ScheduledForUtc);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return _mapper.Map<TrainingResponse>(training);
    }

    public async Task<bool> DeleteTrainingAsync(Guid id, CancellationToken cancellationToken)
    {
        var training = await _repository.GetTrainingAsync(id, cancellationToken);
        if (training is null) return false;
        _repository.RemoveTraining(training);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return true;
    }

    public async Task<PagedResult<PaymentResponse>> ListPaymentsAsync(int page, int perPage, CancellationToken cancellationToken)
    {
        var (items, total) = await _repository.ListPaymentsAsync(NormalizePage(page), NormalizePerPage(perPage), cancellationToken);
        return Page(items.Select(_mapper.Map<PaymentResponse>).ToList(), page, perPage, total);
    }

    public async Task<PagedResult<PaymentResponse>?> ListPaymentsByStudentUserIdAsync(Guid userId, int page, int perPage, CancellationToken cancellationToken)
    {
        var student = await _repository.GetStudentByUserIdAsync(userId, cancellationToken);
        if (student is null) return null;
        var (items, total) = await _repository.ListPaymentsByStudentIdAsync(student.Id, NormalizePage(page), NormalizePerPage(perPage), cancellationToken);
        return Page(items.Select(_mapper.Map<PaymentResponse>).ToList(), page, perPage, total);
    }

    public async Task<PaymentResponse?> GetPaymentAsync(Guid id, CancellationToken cancellationToken)
        => _mapper.Map<PaymentResponse?>(await _repository.GetPaymentAsync(id, cancellationToken));

    public async Task<PaymentResponse> CreatePaymentAsync(CreatePaymentRequest request, CancellationToken cancellationToken)
    {
        var payment = Payment.Create(request.StudentId, request.Amount, request.DueDateUtc);
        await _repository.AddPaymentAsync(payment, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return _mapper.Map<PaymentResponse>(payment);
    }

    public async Task<PaymentResponse?> UpdatePaymentAsync(Guid id, UpdatePaymentRequest request, CancellationToken cancellationToken)
    {
        var payment = await _repository.GetPaymentAsync(id, cancellationToken);
        if (payment is null) return null;
        payment.Update(request.Amount, request.DueDateUtc, request.Status);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return _mapper.Map<PaymentResponse>(payment);
    }

    public async Task<bool> DeletePaymentAsync(Guid id, CancellationToken cancellationToken)
    {
        var payment = await _repository.GetPaymentAsync(id, cancellationToken);
        if (payment is null) return false;
        _repository.RemovePayment(payment);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return true;
    }

    private static PagedResult<T> Page<T>(IReadOnlyList<T> items, int page, int perPage, int total)
        => new(items, NormalizePage(page), NormalizePerPage(perPage), total);

    private static int NormalizePage(int page) => Math.Max(1, page);
    private static int NormalizePerPage(int perPage) => Math.Clamp(perPage, 1, 100);
}
