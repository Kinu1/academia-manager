using AcademiaManager.Application.Academia;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AcademiaManager.Api.Controllers;

[Authorize]
[Route("api/v1/students")]
public sealed class StudentsController : BaseApiController
{
    private readonly IAcademiaService _service;

    public StudentsController(IAcademiaService service) => _service = service;

    [Authorize(Roles = "Admin,Trainer")]
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int perPage = 20, CancellationToken cancellationToken = default)
        => Ok(await _service.ListStudentsAsync(page, perPage, cancellationToken));

    [Authorize(Roles = "Student")]
    [HttpGet("me")]
    public async Task<IActionResult> GetMe(CancellationToken cancellationToken)
    {
        if (CurrentUserId is not { } userId)
        {
            return UnauthorizedError("invalid_token", "Current user could not be identified.");
        }

        var student = await _service.GetStudentByUserIdAsync(userId, cancellationToken);
        return student is null ? NotFoundError("student_profile_not_found", "Student profile was not found for the current user.") : OkData(student);
    }

    [Authorize(Roles = "Student")]
    [HttpPut("me/plan")]
    public async Task<IActionResult> ChoosePlan(ChooseStudentPlanRequest request, CancellationToken cancellationToken)
    {
        if (CurrentUserId is not { } userId)
        {
            return UnauthorizedError("invalid_token", "Current user could not be identified.");
        }

        var result = await _service.ChooseCurrentStudentPlanAsync(userId, request, cancellationToken);
        if (result.IsSuccess)
        {
            return OkData(result.Value!);
        }

        return result.Error?.Code switch
        {
            "student_profile_not_found" => NotFoundError(result.Error.Code, result.Error.Message),
            "plan_not_found" => NotFoundError(result.Error.Code, result.Error.Message),
            "plan_already_selected" => ConflictError(result.Error.Code, result.Error.Message),
            _ => BadRequestError(result.Error?.Code ?? "plan_selection_failed", result.Error?.Message ?? "Plan could not be selected.")
        };
    }

    [Authorize(Roles = "Student")]
    [HttpGet("me/payments")]
    public async Task<IActionResult> GetMyPayments([FromQuery] int page = 1, [FromQuery] int perPage = 20, CancellationToken cancellationToken = default)
    {
        if (CurrentUserId is not { } userId)
        {
            return UnauthorizedError("invalid_token", "Current user could not be identified.");
        }

        var payments = await _service.ListPaymentsByStudentUserIdAsync(userId, page, perPage, cancellationToken);
        return payments is null ? NotFoundError("student_profile_not_found", "Student profile was not found for the current user.") : Ok(payments);
    }

    [Authorize(Roles = "Admin,Trainer")]
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var student = await _service.GetStudentAsync(id, cancellationToken);
        return student is null ? NotFoundError("student_not_found", "Student not found.") : OkData(student);
    }

    [Authorize(Roles = "Admin,Trainer")]
    [HttpPost]
    public async Task<IActionResult> Create(CreateStudentRequest request, CancellationToken cancellationToken)
    {
        var student = await _service.CreateStudentAsync(request, cancellationToken);
        return CreatedData(nameof(GetById), new { id = student.Id }, student);
    }

    [Authorize(Roles = "Admin,Trainer")]
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, UpdateStudentRequest request, CancellationToken cancellationToken)
    {
        var student = await _service.UpdateStudentAsync(id, request, cancellationToken);
        return student is null ? NotFoundError("student_not_found", "Student not found.") : OkData(student);
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
        => await _service.DeleteStudentAsync(id, cancellationToken)
            ? NoContent()
            : NotFoundError("student_not_found", "Student not found.");
}
