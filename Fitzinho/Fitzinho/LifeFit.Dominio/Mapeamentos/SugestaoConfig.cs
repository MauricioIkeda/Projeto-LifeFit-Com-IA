using LifeFit.Dominio.Entidades;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LifeFit.Dominio.Mapeamentos
{
    public class SugestaoConfig : IEntityTypeConfiguration<Sugestao>
    {
        public void Configure(EntityTypeBuilder<Sugestao> builder)
        {
            builder.HasKey(x => x.Id);

            builder.HasOne(x => x.PerfilUsuario)
                .WithMany()
                .HasForeignKey(x => x.PerfilUsuarioId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(x => x.Exercicio)
                .WithMany()
                .HasForeignKey(x => x.ExercicioId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(x => x.Requisicao)
                .WithMany(x => x.Sugestoes)
                .HasForeignKey(x => x.RequisicaoId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
