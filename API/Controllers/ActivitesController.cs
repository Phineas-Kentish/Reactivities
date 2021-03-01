using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Application.Activities;
using Domain;
using Microsoft.AspNetCore.Authorization;

namespace API.Controllers
{
    public class ActivitiesController : BaseApiController
    {                
        [HttpGet] // Get all
        public async Task <IActionResult> GetActivites()
        {                        
            return HandleResult(await Mediator.Send(new List.Query()));
        }
        
        [HttpGet("{id}")] // Get one
        public async Task <IActionResult> GetActivity(Guid id)
        {            
            return HandleResult(await Mediator.Send(new Details.Query{Id = id}));
        }

        [HttpPost] // Create
        public async Task<IActionResult> CreateActivity(Activity activity)
        {
            return HandleResult(await Mediator.Send(new Create.Command {Activity = activity}));
        }

        [Authorize(Policy = "IsActivityHost")]
        [HttpPut("{id}")] // Update
        public async Task<IActionResult> EditActivity (Guid id, Activity activity)
        {
            activity.Id = id;
            return HandleResult(await Mediator.Send(new Edit.Command{Activity = activity}));
        }

        [Authorize(Policy = "IsActivityHost")]
        [HttpDelete("{id}")] // Delete
        public async Task<IActionResult> DeleteActivity(Guid id)
        {
            return HandleResult(await Mediator.Send(new Delete.Command{Id = id}));
        }

        [HttpPost("{id}/attend")] // Attend
        public async Task<IActionResult> Attend(Guid id)
        {
            return HandleResult(await Mediator.Send(new UpdateAttendance.Command{Id = id}));
        }
    }
}