using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;
using Microsoft.EntityFrameworkCore;
using Persistence;
using Application.Activities;
using MediatR;
using Application.Core;
using Application.Interfaces;
using Infastructure.Security;

namespace API.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationServices (this IServiceCollection services, IConfiguration config)
        {
            // API documentation, go to http://localhost:5000/swagger
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "API", Version = "v1" });
            });

            // Database connection
            services.AddDbContext<DataContext>(options =>                 
                options.UseNpgsql(config.GetConnectionString("DefaultConnection"))
            );
            
            // CORS Config
            services.AddCors(options => 
            {
                options.AddPolicy("CorsPolicy", policy => 
                {
                    policy
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        .AllowCredentials()
                        // .AllowAnyOrigin();
                        .WithOrigins("*://localhost:* https://pages.phintech.co.uk");
                });
            });

            services.AddMediatR(typeof(List.Handler).Assembly);            
            services.AddAutoMapper(typeof(MappingProfiles).Assembly);

            // This allows us to access the username of the current             
            // user from anywhere in the application
            services.AddScoped<IUserAccessor, UserAccessor>();

            services.AddSignalR();

            return services;
        }
    }
}