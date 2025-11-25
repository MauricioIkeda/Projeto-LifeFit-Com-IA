using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LifeFit.Dominio.Migrations
{
    /// <inheritdoc />
    public partial class Colocandonomeefocomuscularnomenasugestao : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "FocoMuscular",
                table: "Sugestoes",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "NomeExercicio",
                table: "Sugestoes",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FocoMuscular",
                table: "Sugestoes");

            migrationBuilder.DropColumn(
                name: "NomeExercicio",
                table: "Sugestoes");
        }
    }
}
