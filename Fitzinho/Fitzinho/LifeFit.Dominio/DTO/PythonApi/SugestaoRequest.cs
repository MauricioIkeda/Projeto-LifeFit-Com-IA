using LifeFit.Dominio.ObjetosValor;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LifeFit.Dominio.DTO.PythonApi
{
    public class SugestaoRequest
    {
        public int idade { get; set; }
        public float peso { get; set; }
        public int altura { get; set; }
        public SexoEnum genero { get; set; }
        public NivelAtividadeFisica atividade { get; set; }
        public ObjetivoUsuario objetivo { get; set; }
        public FocoMuscular foco_muscular { get; set; }
    }
}
