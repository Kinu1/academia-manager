using AcademiaManager.Application.Common;

namespace AcademiaManager.Application.Academia;

public interface IAcademiaService
{
    Task<PagedResult<StudentResponse>> ListStudentsAsync(int page, int perPage, CancellationToken cancellationToken);
    Task<StudentResponse?> GetStudentAsync(Guid id, CancellationToken cancellationToken);
    Task<StudentResponse?> GetStudentByUserIdAsync(Guid userId, CancellationToken cancellationToken);
    Task<StudentResponse> CreateStudentAsync(CreateStudentRequest request, CancellationToken cancellationToken);
    Task<StudentResponse?> UpdateStudentAsync(Guid id, UpdateStudentRequest request, CancellationToken cancellationToken);
    Task<Result<StudentResponse>> ChooseCurrentStudentPlanAsync(Guid userId, ChooseStudentPlanRequest request, CancellationToken cancellationToken);
    Task<bool> DeleteStudentAsync(Guid id, CancellationToken cancellationToken);

    Task<PagedResult<PlanResponse>> ListPlansAsync(int page, int perPage, CancellationToken cancellationToken);
    Task<PlanResponse?> GetPlanAsync(Guid id, CancellationToken cancellationToken);
    Task<PlanResponse> CreatePlanAsync(CreatePlanRequest request, CancellationToken cancellationToken);
    Task<PlanResponse?> UpdatePlanAsync(Guid id, UpdatePlanRequest request, CancellationToken cancellationToken);
    Task<bool> DeletePlanAsync(Guid id, CancellationToken cancellationToken);

    Task<PagedResult<TrainingResponse>> ListTrainingsAsync(int page, int perPage, CancellationToken cancellationToken);
    Task<TrainingResponse?> GetTrainingAsync(Guid id, CancellationToken cancellationToken);
    Task<TrainingResponse> CreateTrainingAsync(CreateTrainingRequest request, CancellationToken cancellationToken);
    Task<TrainingResponse?> UpdateTrainingAsync(Guid id, UpdateTrainingRequest request, CancellationToken cancellationToken);
    Task<bool> DeleteTrainingAsync(Guid id, CancellationToken cancellationToken);

    Task<PagedResult<PaymentResponse>> ListPaymentsAsync(int page, int perPage, CancellationToken cancellationToken);
    Task<PagedResult<PaymentResponse>?> ListPaymentsByStudentUserIdAsync(Guid userId, int page, int perPage, CancellationToken cancellationToken);
    Task<PaymentResponse?> GetPaymentAsync(Guid id, CancellationToken cancellationToken);
    Task<PaymentResponse> CreatePaymentAsync(CreatePaymentRequest request, CancellationToken cancellationToken);
    Task<PaymentResponse?> UpdatePaymentAsync(Guid id, UpdatePaymentRequest request, CancellationToken cancellationToken);
    Task<bool> DeletePaymentAsync(Guid id, CancellationToken cancellationToken);
}
