using AcademiaManager.Application.Academia;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AcademiaManager.Api.Controllers;

[Authorize]
[Route("api/v1/plans")]
public sealed class PlansController : BaseApiController
{
    private readonly IAcademiaService _service;

    public PlansController(IAcademiaService service) => _service = service;

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int perPage = 20, CancellationToken cancellationToken = default)
        => Ok(await _service.ListPlansAsync(page, perPage, cancellationToken));

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var plan = await _service.GetPlanAsync(id, cancellationToken);
        return plan is null ? NotFoundError("plan_not_found", "Plan not found.") : OkData(plan);
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> Create(CreatePlanRequest request, CancellationToken cancellationToken)
    {
        var plan = await _service.CreatePlanAsync(request, cancellationToken);
        return CreatedData(nameof(GetById), new { id = plan.Id }, plan);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, UpdatePlanRequest request, CancellationToken cancellationToken)
    {
        var plan = await _service.UpdatePlanAsync(id, request, cancellationToken);
        return plan is null ? NotFoundError("plan_not_found", "Plan not found.") : OkData(plan);
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
        => await _service.DeletePlanAsync(id, cancellationToken)
            ? NoContent()
            : NotFoundError("plan_not_found", "Plan not found.");
}
