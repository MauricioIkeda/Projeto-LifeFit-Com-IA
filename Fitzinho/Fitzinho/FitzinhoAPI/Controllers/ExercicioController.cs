using AutoMapper;
using FGB.Api.Controllers;
using LifeFit.Dominio.Entidades;
using LifeFit.Dominio.Servicos;
using Microsoft.AspNetCore.Mvc;

namespace FitzinhoAPI.Controllers
{
    public class ExercicioController : ApiCrudController<Exercicio, Exercicio>
    {
        public ExercicioController(ExercicioServico servico, IMapper mapper) : base(servico, mapper)
        {
        }
    }
}
