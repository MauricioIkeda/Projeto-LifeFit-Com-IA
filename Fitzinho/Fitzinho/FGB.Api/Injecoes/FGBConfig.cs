using FGB.Dominio.Repositorios.FGB.Infra;
using FGB.Dominio.Repositorios.IRepositorios;
using Microsoft.AspNetCore.OData;
using System.Text.Json.Serialization;

namespace FGB.Api.Injecoes
{
    public static class FGBConfig
    {
        public static IServiceCollection AddFGB(this IServiceCollection services)
        {
            services.AddControllers()
                .AddOData(opt => opt
                    .Select()
                    .Filter()
                    .OrderBy()
                    .Count()
                    .Expand()
                    .SetMaxTop(1000)
                )
                .AddJsonOptions(opt =>
                {
                    opt.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
                    opt.JsonSerializerOptions.DefaultIgnoreCondition =
                        JsonIgnoreCondition.WhenWritingDefault;
                });

            services.AddScoped<IRepositorio, RepositorioEF>();

            return services;
        }
    }
}
