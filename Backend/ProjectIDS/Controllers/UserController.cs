using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectIDS.Data;
using ProjectIDS.Models;
using ProjectIDS.Models.Dtos;
using ProjectIDS.Models.DTos;
using System.Security.Cryptography;
using System.Text;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly AppDbContext _context;

    public UsersController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<User>>> GetUsers()
    {
        return await _context.Users.ToListAsync();
    }

    [HttpGet("{username}/posts")]
    public async Task<IActionResult> GetPostsByUser(string username)
    {
        if (string.IsNullOrWhiteSpace(username))
            return BadRequest(new { message = "Username cannot be empty." });

        
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username); // put the searched username in var user

        if (user == null)
            return NotFound(new { message = $"User with username '{username}' not found." });
        
        var posts = await _context.Posts
            .Where(p => p.UserID == user.UserID)
            .Select(p => new PostDto
            {
                PostID = p.PostID,
                UserID = p.UserID,
                Title = p.Title,
                Description = p.Description,
                CreatedAt = p.CreatedAt,
                UpdatedAt = p.UpdatedAt,
                CategoryID = p.CategoryID,
                Comments = p.Comments.Select(c => new CommentDto
                {
                    CommentID = c.CommentID,
                    Content = c.Content,
                    CreatedAt = c.CreatedAt,
                    UserID = c.UserID
                }).ToList()
            })
            .ToListAsync();

        if (posts == null || !posts.Any())
            return NotFound(new { message = $"No posts found for user '{username}'." });

        return Ok(posts);
    }

[HttpPost]
    public async Task<IActionResult> CreateUser([FromBody] UserCreateDto userDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var user = new User
        {
            Username = userDto.Username,
            Email = userDto.Email,
            PasswordHash = userDto.PasswordHash,
            Role = userDto.Role,
            ReputationPoints = userDto.ReputationPoints,
            CreatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok(new { message = "User created successfully", user });
    }

    [HttpPut("{username}/username")]
    public async Task<IActionResult> UpdateUsername(string username, [FromBody] UpdateUsernameDto dto)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
        if (user == null) return NotFound("User not found.");

        user.Username = dto.NewUsername;
        await _context.SaveChangesAsync();
        return Ok("Username updated successfully.");
    }
    [HttpPut("{username}/password")]
    public async Task<IActionResult> UpdatePassword(string username, [FromBody] UpdatePasswordDto dto)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
        if (user == null) return NotFound("User not found.");

        user.PasswordHash = dto.NewPassword; 
        await _context.SaveChangesAsync();
        return Ok("Password updated successfully.");
    }

    [HttpDelete("{username}")]
    public async Task<IActionResult> DeleteUser(string username)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);

        if (user == null)
        {
            return NotFound();
        }

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
