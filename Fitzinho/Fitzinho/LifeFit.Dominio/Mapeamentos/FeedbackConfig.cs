using LifeFit.Dominio.Entidades;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LifeFit.Dominio.Mapeamentos
{
    public class FeedbackConfig : IEntityTypeConfiguration<Feedback>
    {
        public void Configure(EntityTypeBuilder<Feedback> builder)
        {
            builder.HasKey(x => x.Id);

            builder.HasOne(x => x.sugestao)
                .WithMany()
                .HasForeignKey(x => x.sugestaoId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
