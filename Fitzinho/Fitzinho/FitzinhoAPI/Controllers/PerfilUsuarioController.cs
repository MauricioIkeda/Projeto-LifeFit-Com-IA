using AutoMapper;
using FGB.Api.Controllers;
using LifeFit.Dominio.Entidades;
using LifeFit.Dominio.Servicos;
using Microsoft.AspNetCore.Mvc;

namespace FitzinhoAPI.Controllers
{
    public class PerfilUsuarioController : ApiCrudController<PerfilUsuario, PerfilUsuario>
    {
        public PerfilUsuarioController(PerfilUsuarioServico servico, IMapper mapper) : base(servico, mapper)
        {
        }
    }
}
