using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FGB.Dominio.Entidades
{
    public class MensagemRetorno
    {
        public string Mensagem { get; set; }
        public bool Erro { get; set; }
        public Exception Exception { get; set; }

        public MensagemRetorno() { }

        public MensagemRetorno(string mensagem, bool erro = false)
        {
            Mensagem = mensagem;
            Erro = erro;
        }

        public MensagemRetorno(Exception exception)
        {
            Exception = exception;
            Mensagem = exception.Message;
            Erro = true;
        }
    }
}
