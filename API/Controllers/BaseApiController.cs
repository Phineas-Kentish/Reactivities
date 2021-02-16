using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{

    [ApiController]
    [Route("api/[controller]")] // This will name the route after the controller but without "controller".

    public class BaseApiController : ControllerBase
    {
        
    }
}