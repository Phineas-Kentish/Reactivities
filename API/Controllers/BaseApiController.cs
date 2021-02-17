using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Mvc;
using MediatR;

namespace API.Controllers
{

    [ApiController]
    [Route("api/[controller]")] // This will name the route after the controller but without "controller".

    public class BaseApiController : ControllerBase
    {
        private IMediator _mediator;

        protected IMediator Mediator => _mediator ??= HttpContext.RequestServices.GetService<IMediator>();
        
    }
}