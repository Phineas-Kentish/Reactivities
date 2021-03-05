using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Extensions;
using API.Middleware;
using API.SignalR;
using Application.Activities;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;


namespace API
{
    public class Startup
    {
        private readonly IConfiguration _config;
        
        public Startup(IConfiguration config)
        {            
            _config = config;
        }        

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers(opt => {
                // This makes all endpoints require authentications by default!
                var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
                opt.Filters.Add(new AuthorizeFilter(policy));
            })
            .AddFluentValidation(config => 
            {
                config.RegisterValidatorsFromAssemblyContaining<Create>();
            });
            // Configure services               
            services.AddApplicationServices(_config);         
            services.AddIdentityServices(_config);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline (middleware).
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env){
            
            // Use custom exception middleware
            app.UseMiddleware<ExceptionMiddleware>();
            if (env.IsDevelopment())
            {
                // Disable stock exception middleware
                // app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "API v1"));
            }

            app.UseHttpsRedirection();

            app.UseRouting();

            // This will look for index.html inside wwwroot
            app.UseDefaultFiles();
            // This will serve the files
            app.UseStaticFiles();

            app.UseCors("CorsPolicy");

            // Authentication MUST BE BEFORE Authorization
            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                // Route for API
                endpoints.MapControllers();                
                // Route for serving files 
                endpoints.MapFallbackToController("Index", "Fallback");
                // Route for SingalR
                endpoints.MapHub<ChatHub>("/chat");
            });
        }
    }
}
