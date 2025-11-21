using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LifeFit.Dominio.DTO.PythonApi
{
    public class SugestaoResponse
    {
        public int rank { get; set; }
        public string exercicio_nome { get; set; }
        public int exercicio_id { get; set; }
        public string grupo_muscular { get; set; }
        public int grupo_muscular_id { get; set; }
        public string match_score { get; set; }
    }
}
