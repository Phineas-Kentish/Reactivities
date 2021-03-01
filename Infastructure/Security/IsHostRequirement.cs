using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Infastructure.Security
{
    public class IsHostRequirement : IAuthorizationRequirement {}

    // This is a service that we can use to easily find out if the
    // current user is the host (and rightful owner) of an 
    // activity so we can then authorize permssions

    public class IsHostRequirementHandler : AuthorizationHandler<IsHostRequirement>
    {
        private DataContext _dbContext;
        private IHttpContextAccessor _httpContextAccessor;

        public IsHostRequirementHandler (DataContext dbContext, IHttpContextAccessor httpContextAccessor) 
        {
             _dbContext = dbContext;
             _httpContextAccessor = httpContextAccessor;
        }

        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, IsHostRequirement requirement)
        {
            var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null) return Task.CompletedTask;

            var activityId = Guid.Parse(_httpContextAccessor.HttpContext?.Request.RouteValues.SingleOrDefault(
                x => x.Key == "id").Value?.ToString());

            var attendee = _dbContext.ActivityAttendees
                .AsNoTracking()
                .SingleOrDefaultAsync((x) => x.AppUserId == userId && x.ActivityId == activityId)
                .Result;

            if (attendee == null) return Task.CompletedTask;

            if (attendee.IsHost) context.Succeed(requirement);

            return Task.CompletedTask;
        }
    }
}