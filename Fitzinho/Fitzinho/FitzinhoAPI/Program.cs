using FGB.Api.Injecoes;
using LifeFit.Dominio.Servicos;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddFGB();
builder.Services.AddAutoMapperProfiles();

builder.Services.AddTransient<RequisicaoSugestaoServico>();
builder.Services.AddTransient<PerfilUsuarioServico>();
builder.Services.AddTransient<ExercicioServico>();
builder.Services.AddTransient<FeedbackServico>();
builder.Services.AddTransient<SugestaoServico>();

builder.Services.AddDbContext<DbContext>(options =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"));
});


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
