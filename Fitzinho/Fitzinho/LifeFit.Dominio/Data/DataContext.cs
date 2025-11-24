using LifeFit.Dominio.Entidades;
using Microsoft.EntityFrameworkCore;

namespace LifeFit.Dominio.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions options) : base(options)
        {

        }
        public DbSet<Exercicio> Exercicios { get; set; }
        public DbSet<Feedback> Feedbacks { get; set; }
        public DbSet<PerfilUsuario> PerfisUsuarios { get; set; }
        public DbSet<RequisicaoSugestao> RequisicoesSugestao { get; set; }
        public DbSet<Sugestao> Sugestoes { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(DataContext).Assembly);
        }

    }
}