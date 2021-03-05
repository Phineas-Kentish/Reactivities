using System.Linq;
using Application.Activities;
using Application.Comments;
using AutoMapper;
using Domain;

namespace Application.Core
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles () 
        {
            // This is to map through the fields of an activitie 
            // sent from the client when creating or editing.

            CreateMap<Activity, Activity>();

            // This is to find the host of the activity and then 
            // add just their username to the HostUsername
            // field of the ActivityDto 

            CreateMap<Activity, ActivityDto>()
                .ForMember(
                    d => d.HostUsername, 
                    o => o.MapFrom(
                        s => s.Attendees.FirstOrDefault(
                            x => x.IsHost
                        ).AppUser.UserName));

            // This is to add the related users to an activity
            // as Profile objects 

            CreateMap<ActivityAttendee, Profiles.Profile>()
                .ForMember(
                    d => d.DisplayName, // Map to
                    o => o.MapFrom(s => s.AppUser.DisplayName) // Map from
                )
                .ForMember(
                    d => d.Username, 
                    o => o.MapFrom(s => s.AppUser.UserName)
                )
                .ForMember(
                    d => d.Bio, 
                    o => o.MapFrom(s => s.AppUser.Bio));

            // Comment DTO to contain Author data
            CreateMap<Comment, CommentDto>()   
                .ForMember(
                    d => d.DisplayName, // Map to
                    o => o.MapFrom(s => s.Author.DisplayName) // Map from
                )
                .ForMember(
                    d => d.Username, 
                    o => o.MapFrom(s => s.Author.UserName)
                );      
        }
    }
}