using AcademiaManager.Domain.Common;

namespace AcademiaManager.Domain.Entities;

public sealed class Training : Entity
{
    private Training() { }

    private Training(Guid studentId, string title, string description, DateTime scheduledForUtc)
    {
        StudentId = studentId;
        Title = title;
        Description = description;
        ScheduledForUtc = scheduledForUtc;
    }

    public Guid StudentId { get; private set; }
    public Student Student { get; private set; } = null!;
    public string Title { get; private set; } = string.Empty;
    public string Description { get; private set; } = string.Empty;
    public DateTime ScheduledForUtc { get; private set; }

    public static Training Create(Guid studentId, string title, string description, DateTime scheduledForUtc)
    {
        if (studentId == Guid.Empty)
        {
            throw new ArgumentException("Student id is required.", nameof(studentId));
        }

        if (string.IsNullOrWhiteSpace(title))
        {
            throw new ArgumentException("Title is required.", nameof(title));
        }

        return new Training(studentId, title.Trim(), description.Trim(), scheduledForUtc);
    }

    public void Update(string title, string description, DateTime scheduledForUtc)
    {
        if (string.IsNullOrWhiteSpace(title))
        {
            throw new ArgumentException("Title is required.", nameof(title));
        }

        Title = title.Trim();
        Description = description.Trim();
        ScheduledForUtc = scheduledForUtc;
        MarkUpdated();
    }
}
