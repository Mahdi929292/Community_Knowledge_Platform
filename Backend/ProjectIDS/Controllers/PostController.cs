using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectIDS.Data;
using ProjectIDS.Models;
using ProjectIDS.Models.DTos;

[ApiController]
[Route("api/[controller]")]
public class PostsController : ControllerBase
{
    private readonly AppDbContext _context;

    public PostsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var posts = await _context.Posts
            .Include(p => p.Comments)
            .ThenInclude(c => c.User)
            .Select(p => new PostDto
            {
                PostID = p.PostID,
                UserID = p.UserID,
                Title = p.Title,
                Description = p.Description,
                CreatedAt = p.CreatedAt,
                UpdatedAt = p.UpdatedAt,
                CategoryID = p.CategoryID,
                Votes = p.Votes,
                Comments = p.Comments.Select(c => new CommentDto
                {
                    CommentID = c.CommentID,
                    Content = c.Content,
                    CreatedAt = c.CreatedAt,
                    UserID = c.UserID
                }).ToList()
            })
            .ToListAsync();

        return Ok(posts);
    }

    [HttpGet("search")]
    public async Task<IActionResult> SearchPosts([FromQuery] string query, [FromQuery] int? categoryId)
    {
        if (string.IsNullOrWhiteSpace(query))
            return BadRequest(new { Message = "Search query cannot be empty." });

        var results = _context.Posts.AsQueryable();

        results = results.Where(p => EF.Functions.Like(p.Title, $"%{query}%"));

        if (categoryId.HasValue && categoryId.Value > 0)
        {
            results = results.Where(p => p.CategoryID == categoryId.Value);
        }

        var posts = await results.ToListAsync();

        return posts.Any() ? Ok(posts) : NotFound(new { Message = "No posts found." });
    }


    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var post = await _context.Posts
            .Include(p => p.Comments)
            .ThenInclude(c => c.User)
            .FirstOrDefaultAsync(p => p.PostID == id);

        if (post == null)
            return NotFound(new { Message = $"Post with ID {id} not found." });

        return Ok(new PostDto
        {
            PostID = post.PostID,
            UserID = post.UserID,
            Title = post.Title,
            Description = post.Description,
            CreatedAt = post.CreatedAt,
            UpdatedAt = post.UpdatedAt,
            CategoryID = post.CategoryID,
            Votes = post.Votes,
            Comments = post.Comments.Select(c => new CommentDto
            {
                CommentID = c.CommentID,
                Content = c.Content,
                CreatedAt = c.CreatedAt,
                UserID = c.UserID
            }).ToList()
        });
    }

    [HttpPut("{id}/votes")]
    public async Task<IActionResult> UpdateVotes(int id, [FromBody] string action)
    {
        var post = await _context.Posts.FindAsync(id);
        if (post == null)
            return NotFound(new { Message = $"Post with ID {id} not found." });

        if (action == "upvote") post.Votes++;
        else if (action == "downvote") post.Votes--;
        else return BadRequest(new { Message = "Invalid action. Use 'upvote' or 'downvote'." });

        await _context.SaveChangesAsync();
        return Ok(new { Message = "Vote updated.", Votes = post.Votes });
    }

    [HttpPut("{postId}")]
    public async Task<IActionResult> EditPost(int postId, [FromBody] EditPostDto dto)
    {
        var post = await _context.Posts.FindAsync(postId);
        if (post == null) return NotFound(new { Message = "Post not found." });

        post.Title = dto.Title;
        post.Description = dto.Description;
        await _context.SaveChangesAsync();
        return Ok(new { Message = "Post updated successfully." });
    }

    [HttpPost]
    public async Task<IActionResult> CreatePost([FromBody] PostDto postDto)
    {
        if (string.IsNullOrWhiteSpace(postDto.Title) || string.IsNullOrWhiteSpace(postDto.Description))
            return BadRequest(new { Message = "Title and Description are required." });

        var post = new Post
        {
            UserID = postDto.UserID,
            Title = postDto.Title,
            Description = postDto.Description,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            CategoryID = postDto.CategoryID
        };

        await _context.Posts.AddAsync(post);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = post.PostID }, post);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePost(int id)
    {
        var post = await _context.Posts.FindAsync(id);
        if (post == null)
            return NotFound(new { Message = $"Post with ID {id} not found." });

        _context.Posts.Remove(post);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    // Comments section:



    [HttpGet("{postId}/comments")]
    public async Task<IActionResult> GetCommentsForPost(int postId)
    {
        var comments = await _context.Comments
            .Where(c => c.PostID == postId)
            .Select(c => new
            {
                c.CommentID,
                c.Content,
                c.CreatedAt,
                c.UserID,
                UserName = c.User.Username
            })
            .ToListAsync();

        return Ok(comments);
    }

    [HttpPost("{postId}/comments")]
    public async Task<IActionResult> AddComment(int postId, [FromBody] CommentDto commentDto)
    {
        if (string.IsNullOrWhiteSpace(commentDto.Content))
            return BadRequest(new { Message = "Comment content cannot be empty." });

        if (!await _context.Posts.AnyAsync(p => p.PostID == postId))
            return NotFound(new { Message = $"Post with ID {postId} not found." });

        var comment = new Comment
        {
            Content = commentDto.Content,
            CreatedAt = DateTime.UtcNow,
            PostID = postId,
            UserID = commentDto.UserID
        };

        await _context.Comments.AddAsync(comment);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            Message = "Comment added successfully.",
            Comment = new
            {
                comment.CommentID,
                comment.PostID,
                comment.UserID,
                comment.Content,
                comment.CreatedAt
            }
        });
    }

    [HttpDelete("comments/{id}")]
    public async Task<IActionResult> DeleteComment(int id)
    {
        var comment = await _context.Comments.FindAsync(id);
        if (comment == null)
            return NotFound(new { Message = $"Comment with ID {id} not found." });

        _context.Comments.Remove(comment);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
