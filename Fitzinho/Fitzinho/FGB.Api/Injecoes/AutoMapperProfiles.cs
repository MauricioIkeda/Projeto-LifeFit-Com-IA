namespace FGB.Api.Injecoes
{
    public static class AutoMapperConfig
    {
        public static IServiceCollection AddAutoMapperProfiles(this IServiceCollection services)
        {
            services.AddAutoMapper(cfg =>
            {
                cfg.AllowNullCollections = true;
            }, AppDomain.CurrentDomain.GetAssemblies());
            return services;
        }
    }
}
