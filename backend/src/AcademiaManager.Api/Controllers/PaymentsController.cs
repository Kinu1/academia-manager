using AcademiaManager.Application.Academia;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AcademiaManager.Api.Controllers;

[Authorize(Roles = "Admin")]
[Route("api/v1/payments")]
public sealed class PaymentsController : BaseApiController
{
    private readonly IAcademiaService _service;

    public PaymentsController(IAcademiaService service) => _service = service;

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int perPage = 20, CancellationToken cancellationToken = default)
        => Ok(await _service.ListPaymentsAsync(page, perPage, cancellationToken));

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var payment = await _service.GetPaymentAsync(id, cancellationToken);
        return payment is null ? NotFoundError("payment_not_found", "Payment not found.") : OkData(payment);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreatePaymentRequest request, CancellationToken cancellationToken)
    {
        var payment = await _service.CreatePaymentAsync(request, cancellationToken);
        return CreatedData(nameof(GetById), new { id = payment.Id }, payment);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, UpdatePaymentRequest request, CancellationToken cancellationToken)
    {
        var payment = await _service.UpdatePaymentAsync(id, request, cancellationToken);
        return payment is null ? NotFoundError("payment_not_found", "Payment not found.") : OkData(payment);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
        => await _service.DeletePaymentAsync(id, cancellationToken)
            ? NoContent()
            : NotFoundError("payment_not_found", "Payment not found.");
}
