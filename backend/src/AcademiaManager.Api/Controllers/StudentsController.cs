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

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int perPage = 20, CancellationToken cancellationToken = default)
        => Ok(await _service.ListStudentsAsync(page, perPage, cancellationToken));

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
