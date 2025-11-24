using LifeFit.Dominio.Entidades;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LifeFit.Dominio.Mapeamentos
{
    public class RequisicaoSugestaoConfig : IEntityTypeConfiguration<RequisicaoSugestao>
    {
        public void Configure(EntityTypeBuilder<RequisicaoSugestao> builder)
        {
            builder.HasKey(x => x.Id);

            builder.HasOne(x => x.PerfilUsuario)
                .WithMany()
                .HasForeignKey(x => x.PerfilUsuarioId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
