using System.ComponentModel.DataAnnotations;
using FGB.Dominio.Repositorios.IRepositorios;

namespace FGB.Dominio.Validacao
{
    [AttributeUsage(AttributeTargets.Property, AllowMultiple = false)]
    public class ObrigarAttribute : RequiredAttribute
    {
        private readonly Type? _tipoRelacionado;

        public ObrigarAttribute(Type? tipoRelacionado = null)
        {
            _tipoRelacionado = tipoRelacionado;
            ErrorMessage = "{0} deve ser informado.";
        }

        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            if (value == null)
                return CriarErro(validationContext);

            if (value is string s && string.IsNullOrWhiteSpace(s))
                return CriarErro(validationContext);

            if (value is long id && id <= 0)
                return CriarErro(validationContext);

            if (value is long longId)
            {
                // Tenta pegar o repositório
                var repo = (IRepositorio?)validationContext.GetService(typeof(IRepositorio));

                if (repo == null)
                    return ValidationResult.Success;

                Type? tipo = _tipoRelacionado;

                // tenta deduzir o tipo automaticamente
                if (tipo == null)
                {
                    string nomeProp = validationContext.MemberName ?? string.Empty;

                    if (nomeProp.EndsWith("Id", StringComparison.OrdinalIgnoreCase))
                    {
                        string nomeEntidade = nomeProp[..^2]; // remove "Id"

                        tipo = AppDomain.CurrentDomain
                            .GetAssemblies()
                            .SelectMany(a =>
                            {
                                try { return a.GetTypes(); }
                                catch { return Array.Empty<Type>(); }
                            })
                            .FirstOrDefault(t =>
                                t.Name.Equals(nomeEntidade, StringComparison.OrdinalIgnoreCase) ||
                                t.Name.EndsWith(nomeEntidade, StringComparison.OrdinalIgnoreCase));
                    }
                }

                // se encontrou tipo, valida usando o repositório
                if (tipo != null)
                {
                    var metodo = typeof(IRepositorio)
                        .GetMethods()
                        .First(m => m.Name == "Retorna" && m.GetParameters().Length == 1)
                        .MakeGenericMethod(tipo);

                    var entidade = metodo.Invoke(repo, new object[] { longId });

                    if (entidade == null)
                        return new ValidationResult(
                            $"{NomeFormatado(tipo.Name)} com ID {longId} não encontrado.");
                }
            }

            return ValidationResult.Success;
        }

        private static ValidationResult CriarErro(ValidationContext ctx)
        {
            var nome = ctx.MemberName ?? "Campo";
            return new ValidationResult($"{NomeFormatado(nome)} deve ser informado.");
        }

        private static string NomeFormatado(string texto)
        {
            if (texto.EndsWith("Id", StringComparison.OrdinalIgnoreCase))
                texto = texto[..^2];

            return char.ToUpper(texto[0]) + texto[1..];
        }
    }
}
