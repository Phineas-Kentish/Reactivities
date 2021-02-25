using System;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;
using Application.Core;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace API.Middleware
{
    public class ExceptionMiddleware
    {
        // Each piece of middleware is a RequestDelegate which
        // chains onto the next by calling the inherited
        // next() method. If a piece of middleware is
        // not satisfied, it will not call next()

        // This piece of middleware is for handling exceptions
        // throughout the application. It must be first in 
        // list of middlewares so it catches everything.        

        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;
        private readonly IHostEnvironment _env;
        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger, IHostEnvironment env)
        {
            _next = next;
            _logger = logger;
            _env = env;
        }

        public async Task InvokeAsync(HttpContext context) 
        {
            try
            {
                await _next(context);
            } 
            catch (Exception ex) 
            {
                _logger.LogError(ex, ex.Message);
                context.Response.ContentType = "application/json";
                context.Response.StatusCode = (int) HttpStatusCode.InternalServerError;

                var response = _env.IsDevelopment() 
                    ? new AppException(context.Response.StatusCode, ex.Message, ex.StackTrace?.ToString())
                    : new AppException(context.Response.StatusCode, ex.Message, "Server error");

                var options = new JsonSerializerOptions{PropertyNamingPolicy = JsonNamingPolicy.CamelCase};   
                var json = JsonSerializer.Serialize(response, options);
                await context.Response.WriteAsync(json);
                
            }
        }
    }
}