using FGB.Dominio.Entidades;
using LifeFit.Dominio.ObjetosValor;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LifeFit.Dominio.Entidades
{
    public class Exercicio : EntidadeBase
    {
        public  ExercicioEnum Nome { get; set; }
        public FocoMuscular FocoMuscular { get; set; }
    }
}
