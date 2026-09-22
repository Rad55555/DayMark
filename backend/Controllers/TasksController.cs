using backend.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TasksController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TaskItem>>> GetTasks()
    {
        return Ok(await db.Tasks.OrderByDescending(task => task.CreatedAt).ToListAsync());
    }

    [HttpPost]
    public async Task<ActionResult<TaskItem>> CreateTask(CreateTaskRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Title))
        {
            return BadRequest(new { message = "Task title is required." });
        }

        var task = new TaskItem { Title = request.Title.Trim() };
        db.Tasks.Add(task);
        await db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetTasks), new { id = task.Id }, task);
    }

    [HttpPatch("{id:int}")]
    public async Task<ActionResult<TaskItem>> ToggleTask(int id)
    {
        var task = await db.Tasks.FindAsync(id);
        if (task is null) return NotFound();

        task.IsComplete = !task.IsComplete;
        await db.SaveChangesAsync();
        return Ok(task);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteTask(int id)
    {
        var task = await db.Tasks.FindAsync(id);
        if (task is null) return NotFound();

        db.Tasks.Remove(task);
        await db.SaveChangesAsync();
        return NoContent();
    }
}

public record CreateTaskRequest(string Title);