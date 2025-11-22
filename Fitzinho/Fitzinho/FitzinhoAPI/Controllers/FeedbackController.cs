using AutoMapper;
using FGB.Api.Controllers;
using LifeFit.Dominio.Entidades;
using LifeFit.Dominio.Servicos;
using Microsoft.AspNetCore.Mvc;

namespace FitzinhoAPI.Controllers
{
    public class FeedbackController : ApiCrudController<Feedback, Feedback>
    {
        public FeedbackController(FeedbackServico servico, IMapper mapper) : base(servico, mapper)
        {
        }
    }
}
