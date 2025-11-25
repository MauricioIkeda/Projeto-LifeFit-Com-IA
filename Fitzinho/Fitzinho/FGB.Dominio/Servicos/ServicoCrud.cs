using FGB.Dominio.Entidades;
using FGB.Dominio.Repositorios.IRepositorios;

namespace FGB.Dominio.Servicos
{
    public class ServicoCrud<T> : ServicoConsulta<T> where T : EntidadeBase
    {
        public ServicoCrud(IRepositorio repo) : base(repo)
        {
        }

        public virtual bool Valida(T entidade)
        {
            return !Mensagens.HasErro();
        }

        public virtual bool Validacoes(T entidade)
        {
            if (entidade == null)
            {
                Mensagens.Add("Entidade vazia na requisição.");
                return false;
            }
            return Valida(entidade);
        }

        public virtual bool Inclui(T[] entidades)
        {
            try
            {
                if (entidades.Length == 0)
                    return true;

                if (!entidades.All(Validacoes))
                    return false;

                foreach (var entidade in entidades)
                {
                    entidade.CriadoEm = DateTime.UtcNow;
                    entidade.UltimaAlteracao = DateTime.UtcNow;
                    _repo.Inclui(entidade);
                }
                return true;
            }
            catch (Exception ex)
            {
                Mensagens.Add("Erro ao incluir entidade: " + ex.Message);
                return false;
            }
        }

        public virtual async Task<bool> IncluiAsync(T[] entidades)
        {
            try
            {
                if (entidades.Length == 0)
                    return true;
                if (!entidades.All(Validacoes))
                    return false;
                foreach (var entidade in entidades)
                {
                    entidade.CriadoEm = DateTime.UtcNow;
                    entidade.UltimaAlteracao = DateTime.UtcNow;
                    await _repo.IncluiAsync(entidade);
                }
                return true;
            }
            catch (Exception ex)
            {
                Mensagens.Add("Erro ao incluir entidade: " + ex.Message);
                return false;
            }
        }

        public virtual T Merge(T entidade)
        {
            try
            {
                if (!Validacoes(entidade))
                    return entidade;

                entidade.UltimaAlteracao = DateTime.UtcNow;
                var resultado = _repo.Merge(entidade);
                return resultado;
            }
            catch (Exception ex)
            {
                Mensagens.Add("Erro ao atualizar entidade: " + ex.Message);
                return null;
            }
        }

        public virtual async Task<T> MergeAsync(T entidade)
        {
            try
            {
                if (!Validacoes(entidade))
                    return entidade;

                entidade.UltimaAlteracao = DateTime.UtcNow;
                var resultado = await _repo.MergeAsync(entidade);
                return resultado;
            }
            catch (Exception ex)
            {
                Mensagens.Add("Erro ao atualizar entidade: " + ex.Message);
                return null;
            }
        }

        public virtual T Exclui(long id)
        {
            var entidade = Retorna(id);
            if (entidade == null)
            {
                Mensagens.Add("Registro não encontrado.");
                return null;
            }

            var sucesso = Exclui(new[] { entidade });

            return sucesso ? entidade : null;
        }

        public virtual bool Exclui(T[] entidades)
        {
            try
            {
                if (entidades.Length == 0)
                    return true;

                if (!entidades.All(Validacoes))
                    return false;

                foreach (var entidade in entidades)
                {
                    _repo.Exclui(entidade);
                }

                return true;
            }
            catch (Exception ex)
            {
                Mensagens.Add("Erro ao excluir entidade: " + ex.Message);
                return false;
            }
        }

        public virtual async Task<bool> ExcluiAsync(T[] entidades)
        {
            try
            {
                if (entidades.Length == 0)
                    return true;

                if (!entidades.All(Validacoes))
                    return false;
                foreach (var entidade in entidades)
                {
                    await _repo.ExcluiAsync(entidade);
                }
                return true;
            }
            catch (Exception ex)
            {
                Mensagens.Add("Erro ao excluir entidade: " + ex.Message);
                return false;
            }
        }
    }
}
