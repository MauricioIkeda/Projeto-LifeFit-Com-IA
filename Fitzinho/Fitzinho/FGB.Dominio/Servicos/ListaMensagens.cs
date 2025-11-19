using FGB.Dominio.Entidades;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FGB.Dominio.Servicos
{
    public class ListaMensagens : List<MensagemRetorno>
    {
        public void Add(Exception exception)
        {
            Add(new MensagemRetorno(exception));
        }

        public void Add(string mensagem, bool erro = false)
        {
            Add(new MensagemRetorno(mensagem, erro));
        }

        public bool HasErro()
        {
            return this.Any(m => m.Erro);
        }
    }
}
