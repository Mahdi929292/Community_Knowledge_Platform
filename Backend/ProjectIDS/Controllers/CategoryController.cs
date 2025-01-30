using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectIDS.Data;
using ProjectIDS.Models;
using ProjectIDS.Models.DTos;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly AppDbContext _context;

    public CategoriesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        var categories = _context.Categories
            .Select(c => new CategoryDto
            {
                CategoryID = c.CategoryID,
                Name = c.Name
            })
            .ToList();

        return Ok(categories);
    }

    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        var category = _context.Categories
            .Where(c => c.CategoryID == id)
            .Select(c => new CategoryDto
            {
                CategoryID = c.CategoryID,
                Name = c.Name
            })
            .FirstOrDefault();

        if (category == null)
            return NotFound($"Category with ID {id} not found.");

        return Ok(category);
    }

    [HttpPost]
    public IActionResult CreateCategory(CategoryDto categoryDto)
    {
        if (categoryDto == null || string.IsNullOrWhiteSpace(categoryDto.Name))
            return BadRequest("Name is required.");

        var category = new Category
        {
            Name = categoryDto.Name
        };

        try
        {
            _context.Categories.Add(category);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetById), new { id = category.CategoryID }, new CategoryDto
            {
                CategoryID = category.CategoryID,
                Name = category.Name
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    [HttpPut("{id}")]
    public IActionResult UpdateCategory(int id, CategoryDto categoryDto)
    {
        var existingCategory = _context.Categories.FirstOrDefault(c => c.CategoryID == id);
        if (existingCategory == null)
            return NotFound($"Category with ID {id} not found.");

        if (categoryDto == null || string.IsNullOrWhiteSpace(categoryDto.Name))
            return BadRequest("Name is required.");

        existingCategory.Name = categoryDto.Name;

        try
        {
            _context.SaveChanges();
            return NoContent();
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    [HttpDelete("{id}")]
    public IActionResult DeleteCategory(int id)
    {
        var category = _context.Categories.FirstOrDefault(c => c.CategoryID == id);
        if (category == null)
            return NotFound($"Category with ID {id} not found.");

        _context.Categories.Remove(category);

        try
        {
            _context.SaveChanges();
            return NoContent();
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }
}
