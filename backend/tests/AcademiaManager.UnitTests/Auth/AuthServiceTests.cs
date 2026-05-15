using AcademiaManager.Application.Auth;
using AcademiaManager.Application.Interfaces;
using AcademiaManager.Application.Mappings;
using AcademiaManager.Domain.Entities;
using AcademiaManager.Domain.Enums;
using AcademiaManager.Infrastructure.Auth;
using AutoMapper;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;

namespace AcademiaManager.UnitTests.Auth;

public sealed class AuthServiceTests
{
    [Fact]
    public async Task RegisterAsync_ReturnsConflictWhenEmailAlreadyExists()
    {
        var repository = new FakeUserRepository(emailExists: true);
        var service = CreateService(repository, new FakeAcademiaRepository());

        var result = await service.RegisterAsync(
            new RegisterRequest("Aluno", "aluno@example.com", "password123", UserRole.Student),
            CancellationToken.None);

        Assert.False(result.IsSuccess);
        Assert.Equal("email_conflict", result.Error?.Code);
    }

    [Fact]
    public async Task RegisterAsync_RejectsNonStudentPublicRegistration()
    {
        var repository = new FakeUserRepository(emailExists: false);
        var service = CreateService(repository, new FakeAcademiaRepository());

        var result = await service.RegisterAsync(
            new RegisterRequest("Admin", "admin@example.com", "password123", UserRole.Admin),
            CancellationToken.None);

        Assert.False(result.IsSuccess);
        Assert.Equal("role_not_allowed", result.Error?.Code);
        Assert.Empty(repository.Users);
    }

    [Fact]
    public async Task RegisterAsync_CreatesLinkedStudentAndReturnsTokens()
    {
        var userRepository = new FakeUserRepository(emailExists: false);
        var academiaRepository = new FakeAcademiaRepository();
        var service = CreateService(userRepository, academiaRepository);

        var result = await service.RegisterAsync(
            new RegisterRequest("Aluno", "aluno@example.com", "password123", UserRole.Student),
            CancellationToken.None);

        Assert.True(result.IsSuccess);
        Assert.False(string.IsNullOrWhiteSpace(result.Value?.AccessToken));
        Assert.False(string.IsNullOrWhiteSpace(result.Value?.RefreshToken));
        Assert.Single(userRepository.Users);
        var student = Assert.Single(academiaRepository.Students);
        Assert.Equal(userRepository.Users.Single().Id, student.UserId);
    }

    [Fact]
    public async Task RegisterAsync_LinksExistingStudentWithoutUser()
    {
        var userRepository = new FakeUserRepository(emailExists: false);
        var academiaRepository = new FakeAcademiaRepository();
        var existingStudent = Student.Create("Aluno", "aluno@example.com", "11999999999");
        academiaRepository.Students.Add(existingStudent);
        var service = CreateService(userRepository, academiaRepository);

        var result = await service.RegisterAsync(
            new RegisterRequest("Aluno", "aluno@example.com", "password123", UserRole.Student),
            CancellationToken.None);

        Assert.True(result.IsSuccess);
        Assert.Equal(userRepository.Users.Single().Id, existingStudent.UserId);
        Assert.Single(academiaRepository.Students);
    }

    [Fact]
    public async Task RegisterAsync_ReturnsConflictWhenStudentAlreadyLinked()
    {
        var userRepository = new FakeUserRepository(emailExists: false);
        var academiaRepository = new FakeAcademiaRepository();
        academiaRepository.Students.Add(Student.Create("Aluno", "aluno@example.com", "11999999999", Guid.NewGuid()));
        var service = CreateService(userRepository, academiaRepository);

        var result = await service.RegisterAsync(
            new RegisterRequest("Aluno", "aluno@example.com", "password123", UserRole.Student),
            CancellationToken.None);

        Assert.False(result.IsSuccess);
        Assert.Equal("student_user_conflict", result.Error?.Code);
        Assert.Empty(userRepository.Users);
    }

    private static AuthService CreateService(FakeUserRepository repository, FakeAcademiaRepository academiaRepository)
    {
        var mapper = new MapperConfiguration(
            cfg => cfg.AddProfile<AcademiaMappingProfile>(),
            NullLoggerFactory.Instance).CreateMapper();
        var hasher = new PasswordHasher();
        var tokenService = new TokenService(Options.Create(new JwtOptions
        {
            Issuer = "Tests",
            Audience = "Tests",
            Secret = "test-secret-that-is-long-enough-for-hmac",
            AccessTokenMinutes = 5
        }));

        return new AuthService(repository, academiaRepository, hasher, tokenService, new FakeUnitOfWork(), mapper);
    }

    private sealed class FakeUserRepository : IUserRepository
    {
        private readonly bool _emailExists;

        public FakeUserRepository(bool emailExists) => _emailExists = emailExists;

        public List<User> Users { get; } = [];

        public Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken)
            => Task.FromResult(Users.FirstOrDefault(x => x.Email == email));

        public Task<User?> GetByRefreshTokenHashAsync(string tokenHash, CancellationToken cancellationToken)
            => Task.FromResult(Users.FirstOrDefault(x => x.RefreshTokens.Any(t => t.TokenHash == tokenHash)));

        public Task<bool> EmailExistsAsync(string email, CancellationToken cancellationToken)
            => Task.FromResult(_emailExists || Users.Any(x => x.Email == email));

        public Task AddAsync(User user, CancellationToken cancellationToken)
        {
            Users.Add(user);
            return Task.CompletedTask;
        }

        public Task AddRefreshTokenAsync(RefreshToken refreshToken, CancellationToken cancellationToken)
        {
            return Task.CompletedTask;
        }
    }

    private sealed class FakeUnitOfWork : IUnitOfWork
    {
        public Task<int> SaveChangesAsync(CancellationToken cancellationToken) => Task.FromResult(1);
    }

    private sealed class FakeAcademiaRepository : IAcademiaRepository
    {
        public List<Student> Students { get; } = [];

        public Task<(IReadOnlyList<Student> Items, int Total)> ListStudentsAsync(int page, int perPage, CancellationToken cancellationToken)
            => Task.FromResult(((IReadOnlyList<Student>)Students, Students.Count));

        public Task<Student?> GetStudentAsync(Guid id, CancellationToken cancellationToken)
            => Task.FromResult(Students.FirstOrDefault(x => x.Id == id));

        public Task<Student?> GetStudentByEmailAsync(string email, CancellationToken cancellationToken)
            => Task.FromResult(Students.FirstOrDefault(x => x.Email == email));

        public Task<Student?> GetStudentByUserIdAsync(Guid userId, CancellationToken cancellationToken)
            => Task.FromResult(Students.FirstOrDefault(x => x.UserId == userId));

        public Task AddStudentAsync(Student student, CancellationToken cancellationToken)
        {
            Students.Add(student);
            return Task.CompletedTask;
        }

        public void RemoveStudent(Student student) => Students.Remove(student);

        public Task<(IReadOnlyList<Plan> Items, int Total)> ListPlansAsync(int page, int perPage, CancellationToken cancellationToken)
            => Task.FromResult(((IReadOnlyList<Plan>)[], 0));

        public Task<Plan?> GetPlanAsync(Guid id, CancellationToken cancellationToken) => Task.FromResult<Plan?>(null);

        public Task AddPlanAsync(Plan plan, CancellationToken cancellationToken) => Task.CompletedTask;

        public void RemovePlan(Plan plan) { }

        public Task<(IReadOnlyList<Training> Items, int Total)> ListTrainingsAsync(int page, int perPage, CancellationToken cancellationToken)
            => Task.FromResult(((IReadOnlyList<Training>)[], 0));

        public Task<Training?> GetTrainingAsync(Guid id, CancellationToken cancellationToken) => Task.FromResult<Training?>(null);

        public Task AddTrainingAsync(Training training, CancellationToken cancellationToken) => Task.CompletedTask;

        public void RemoveTraining(Training training) { }

        public Task<(IReadOnlyList<Payment> Items, int Total)> ListPaymentsAsync(int page, int perPage, CancellationToken cancellationToken)
            => Task.FromResult(((IReadOnlyList<Payment>)[], 0));

        public Task<(IReadOnlyList<Payment> Items, int Total)> ListPaymentsByStudentIdAsync(Guid studentId, int page, int perPage, CancellationToken cancellationToken)
            => Task.FromResult(((IReadOnlyList<Payment>)[], 0));

        public Task<Payment?> GetPaymentAsync(Guid id, CancellationToken cancellationToken) => Task.FromResult<Payment?>(null);

        public Task AddPaymentAsync(Payment payment, CancellationToken cancellationToken) => Task.CompletedTask;

        public void RemovePayment(Payment payment) { }
    }
}
