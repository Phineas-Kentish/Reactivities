using API.Extensions;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

public class Foobar
{    
    private string str;
    private int Id;
    // calling code where you want to use an extension method defined in IdentityServiceExtensions
    public void AddFooBar(IConfiguration cfg, IServiceCollection sc)
    {
        // two ways to invoke your extension method
        IdentityServiceExtensions.AddIdentityServices(sc, cfg); // 1
        sc.AddIdentityServices(cfg); // 2, preferred

        const string yep = "yes";

        str = "0";
        Id = 0;

    }
    
}
