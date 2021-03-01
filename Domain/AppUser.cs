using System.Collections;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace Domain
{
    public class AppUser : IdentityUser
    {
        // IdentetyUser will give our user entity all the standard 
        // user properties so any extra ones we want 
        // can be made here.

        public string DisplayName { get; set; }

        public string Bio { get; set; }

        public ICollection<ActivityAttendee> Activities { get; set; }

    }
}