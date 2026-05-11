namespace AcademiaManager.Application.Common;

public sealed record PagedResult<T>(
    IReadOnlyList<T> Data,
    int Page,
    int PerPage,
    int Total)
{
    public int TotalPages => Total == 0 ? 0 : (int)Math.Ceiling(Total / (double)PerPage);
}
