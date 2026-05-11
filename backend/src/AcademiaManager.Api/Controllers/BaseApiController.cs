using AcademiaManager.Application.Common;
using Microsoft.AspNetCore.Mvc;

namespace AcademiaManager.Api.Controllers;

[ApiController]
[Produces("application/json")]
public abstract class BaseApiController : ControllerBase
{
    protected IActionResult OkData<T>(T data) => Ok(new ApiResponse<T>(data));

    protected IActionResult CreatedData<T>(string actionName, object routeValues, T data)
        => CreatedAtAction(actionName, routeValues, new ApiResponse<T>(data));

    protected IActionResult NotFoundError(string code, string message)
        => NotFound(new ApiErrorResponse(new ApiError(code, message)));

    protected IActionResult ConflictError(string code, string message)
        => Conflict(new ApiErrorResponse(new ApiError(code, message)));

    protected IActionResult UnauthorizedError(string code, string message)
        => Unauthorized(new ApiErrorResponse(new ApiError(code, message)));
}
