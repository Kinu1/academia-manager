using AcademiaManager.Application.Academia;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AcademiaManager.Api.Controllers;

[Authorize(Roles = "Admin,Trainer")]
[Route("api/v1/trainings")]
public sealed class TrainingsController : BaseApiController
{
    private readonly IAcademiaService _service;

    public TrainingsController(IAcademiaService service) => _service = service;

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int perPage = 20, CancellationToken cancellationToken = default)
        => Ok(await _service.ListTrainingsAsync(page, perPage, cancellationToken));

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var training = await _service.GetTrainingAsync(id, cancellationToken);
        return training is null ? NotFoundError("training_not_found", "Training not found.") : OkData(training);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateTrainingRequest request, CancellationToken cancellationToken)
    {
        var training = await _service.CreateTrainingAsync(request, cancellationToken);
        return CreatedData(nameof(GetById), new { id = training.Id }, training);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, UpdateTrainingRequest request, CancellationToken cancellationToken)
    {
        var training = await _service.UpdateTrainingAsync(id, request, cancellationToken);
        return training is null ? NotFoundError("training_not_found", "Training not found.") : OkData(training);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
        => await _service.DeleteTrainingAsync(id, cancellationToken)
            ? NoContent()
            : NotFoundError("training_not_found", "Training not found.");
}
