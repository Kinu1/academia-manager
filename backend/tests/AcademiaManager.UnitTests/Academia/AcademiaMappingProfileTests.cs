using AcademiaManager.Application.Academia;
using AcademiaManager.Application.Mappings;
using AcademiaManager.Domain.Entities;
using AcademiaManager.Domain.Enums;
using AutoMapper;
using Microsoft.Extensions.Logging.Abstractions;

namespace AcademiaManager.UnitTests.Academia;

public sealed class AcademiaMappingProfileTests
{
    private readonly IMapper _mapper = new MapperConfiguration(
        cfg => cfg.AddProfile<AcademiaMappingProfile>(),
        NullLoggerFactory.Instance).CreateMapper();

    [Fact]
    public void StudentResponse_IncludesEntityTimestamps()
    {
        var student = Student.Create("Joao Silva", "joao@example.com", "11999999999");
        student.Update("Joao Silva", "joao@example.com", "11999999999", StudentStatus.Active, Guid.NewGuid());

        var response = _mapper.Map<StudentResponse>(student);

        Assert.Equal(student.CreatedAtUtc, response.CreatedAtUtc);
        Assert.Equal(student.UpdatedAtUtc, response.UpdatedAtUtc);
    }

    [Fact]
    public void PlanResponse_IncludesEntityTimestamps()
    {
        var plan = Plan.Create("Mensal", 129.90m, 30);
        plan.Update("Mensal Plus", 149.90m, 30, true);

        var response = _mapper.Map<PlanResponse>(plan);

        Assert.Equal(plan.CreatedAtUtc, response.CreatedAtUtc);
        Assert.Equal(plan.UpdatedAtUtc, response.UpdatedAtUtc);
    }

    [Fact]
    public void TrainingResponse_IncludesEntityTimestamps()
    {
        var training = Training.Create(Guid.NewGuid(), "Forca", "Treino A", DateTime.UtcNow.AddDays(1));
        training.Update("Forca superior", "Treino A atualizado", DateTime.UtcNow.AddDays(2));

        var response = _mapper.Map<TrainingResponse>(training);

        Assert.Equal(training.CreatedAtUtc, response.CreatedAtUtc);
        Assert.Equal(training.UpdatedAtUtc, response.UpdatedAtUtc);
    }

    [Fact]
    public void PaymentResponse_IncludesEntityTimestamps()
    {
        var payment = Payment.Create(Guid.NewGuid(), 129.90m, DateTime.UtcNow.AddDays(5));
        payment.Update(129.90m, DateTime.UtcNow.AddDays(5), PaymentStatus.Paid);

        var response = _mapper.Map<PaymentResponse>(payment);

        Assert.Equal(payment.CreatedAtUtc, response.CreatedAtUtc);
        Assert.Equal(payment.UpdatedAtUtc, response.UpdatedAtUtc);
    }
}
