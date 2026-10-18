using Cars.Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Cars.Infrastructure;


namespace Cars.API.Controllers;

public class CarsController : BaseApiController
{
    private readonly DataContext _context;

    public CarsController(DataContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<List<Car>>> GetCars()
    {
        return await _context.Cars.AsNoTracking().ToListAsync();
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<Car>> GetCar(Guid id)
    {
        var car = await _context.Cars.AsNoTracking()
                  .FirstOrDefaultAsync(x => x.Id == id);

        if (car is null) return NotFound();

        return car;
    }

    
    [HttpPost]
    public async Task<ActionResult<Car>> PostCar(Car car)
    {
        _context.Cars.Add(car);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetCar), new { id = car.Id }, car);
    }


    [HttpPut("{id:guid}")]
    public async Task<IActionResult> PutCar(Guid id, Car car)
    {
        if (id != car.Id)
            return BadRequest();

        var existingCar = await _context.Cars.FindAsync(id);

        if (existingCar is null)
            return NotFound();

        _context.Entry(existingCar).CurrentValues.SetValues(car);
        await _context.SaveChangesAsync();

        return NoContent();
    }


    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteCar(Guid id)
    {
        var car = await _context.Cars.FindAsync(id);

        if (car is null)
            return NotFound();

        _context.Cars.Remove(car);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}