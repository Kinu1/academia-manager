using AcademiaManager.Application.Academia;
using AcademiaManager.Application.Auth;
using AcademiaManager.Domain.Entities;
using AutoMapper;

namespace AcademiaManager.Application.Mappings;

public sealed class AcademiaMappingProfile : Profile
{
    public AcademiaMappingProfile()
    {
        CreateMap<User, UserResponse>();
        CreateMap<Student, StudentResponse>();
        CreateMap<Plan, PlanResponse>();
        CreateMap<Training, TrainingResponse>();
        CreateMap<Payment, PaymentResponse>();
    }
}
