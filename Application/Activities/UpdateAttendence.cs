using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using Domain;
using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using System;
using Application.Interfaces;
using SQLitePCL;

namespace Application.Activities
{
    public class UpdateAttendance
    {        
        public class Command : IRequest<Result<Unit>>
        {
            public Guid Id { get; set;}
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            
            public Handler (DataContext context, IUserAccessor userAccessor)
            {
                _context = context;
                _userAccessor = userAccessor;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                // Get activity with users
                var activity = await _context.Activities
                    .Include(a => a.Attendees).ThenInclude(u => u.AppUser)
                    .SingleOrDefaultAsync(x => x.Id == request.Id);

                if (activity == null) return null;

                // Get current user
                var user = await _context.Users.FirstOrDefaultAsync(
                    x => x.UserName == _userAccessor.GetUsername());

                if (user == null) return null;

                // Get host username of activity
                var hostUsername = activity.Attendees.FirstOrDefault(x => x.IsHost)?.AppUser?.UserName;
                // Get boolean for if current user is attending
                var attendance = activity.Attendees.FirstOrDefault(x => x.AppUser.UserName == user.UserName);
                                
                // Make changes
                if (attendance != null) { 
                    // If existing relationship and relation is 
                    // host, then toggle cancel, otherwise
                    // remove the relationship
                    if (hostUsername != user.UserName) {
                        activity.IsCancelled = !activity.IsCancelled;
                    } else {
                        activity.Attendees.Remove(attendance);
                    }
                } else { 
                    // If no existing relationship, create one
                    attendance = new ActivityAttendee
                    {
                        AppUser = user,
                        Activity = activity,
                        IsHost = false
                    };
                    activity.Attendees.Add(attendance);
                }

                var result = await _context.SaveChangesAsync() > 0;

                return result ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Could not update attendance");
            }
        }
    }
}