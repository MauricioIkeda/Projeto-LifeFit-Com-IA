using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace LifeFit.Dominio.Migrations
{
    /// <inheritdoc />
    public partial class Inicial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Exercicios",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Nome = table.Column<string>(type: "text", nullable: true),
                    Enum = table.Column<int>(type: "integer", nullable: false),
                    FocoMuscular = table.Column<int>(type: "integer", nullable: false),
                    FocoMuscularNome = table.Column<string>(type: "text", nullable: true),
                    CriadoEm = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    UltimaAlteracao = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Exercicios", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PerfisUsuarios",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Nome = table.Column<string>(type: "text", nullable: true),
                    Sexo = table.Column<int>(type: "integer", nullable: false),
                    Peso = table.Column<float>(type: "real", nullable: false),
                    Altura = table.Column<int>(type: "integer", nullable: false),
                    Idade = table.Column<int>(type: "integer", nullable: false),
                    NivelAtividadeFisica = table.Column<int>(type: "integer", nullable: false),
                    Objetivo = table.Column<int>(type: "integer", nullable: false),
                    Foco = table.Column<int>(type: "integer", nullable: false),
                    CriadoEm = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    UltimaAlteracao = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PerfisUsuarios", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "RequisicoesSugestao",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    PerfilUsuarioId = table.Column<long>(type: "bigint", nullable: false),
                    FocoMuscular = table.Column<int>(type: "integer", nullable: false),
                    CodigoRetorno = table.Column<string>(type: "text", nullable: true),
                    CriadoEm = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    UltimaAlteracao = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RequisicoesSugestao", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RequisicoesSugestao_PerfisUsuarios_PerfilUsuarioId",
                        column: x => x.PerfilUsuarioId,
                        principalTable: "PerfisUsuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Sugestoes",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Rank = table.Column<int>(type: "integer", nullable: false),
                    PerfilUsuarioId = table.Column<long>(type: "bigint", nullable: false),
                    ExercicioId = table.Column<long>(type: "bigint", nullable: false),
                    RequisicaoId = table.Column<long>(type: "bigint", nullable: false),
                    NomeExercicio = table.Column<string>(type: "text", nullable: true),
                    FocoMuscular = table.Column<string>(type: "text", nullable: true),
                    PontosPerfil = table.Column<string>(type: "text", nullable: true),
                    CriadoEm = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    UltimaAlteracao = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Sugestoes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Sugestoes_Exercicios_ExercicioId",
                        column: x => x.ExercicioId,
                        principalTable: "Exercicios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Sugestoes_PerfisUsuarios_PerfilUsuarioId",
                        column: x => x.PerfilUsuarioId,
                        principalTable: "PerfisUsuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Sugestoes_RequisicoesSugestao_RequisicaoId",
                        column: x => x.RequisicaoId,
                        principalTable: "RequisicoesSugestao",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Feedbacks",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Avaliacao = table.Column<int>(type: "integer", nullable: false),
                    sugestaoId = table.Column<long>(type: "bigint", nullable: false),
                    CriadoEm = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    UltimaAlteracao = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Feedbacks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Feedbacks_Sugestoes_sugestaoId",
                        column: x => x.sugestaoId,
                        principalTable: "Sugestoes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Feedbacks_sugestaoId",
                table: "Feedbacks",
                column: "sugestaoId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_RequisicoesSugestao_PerfilUsuarioId",
                table: "RequisicoesSugestao",
                column: "PerfilUsuarioId");

            migrationBuilder.CreateIndex(
                name: "IX_Sugestoes_ExercicioId",
                table: "Sugestoes",
                column: "ExercicioId");

            migrationBuilder.CreateIndex(
                name: "IX_Sugestoes_PerfilUsuarioId",
                table: "Sugestoes",
                column: "PerfilUsuarioId");

            migrationBuilder.CreateIndex(
                name: "IX_Sugestoes_RequisicaoId",
                table: "Sugestoes",
                column: "RequisicaoId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Feedbacks");

            migrationBuilder.DropTable(
                name: "Sugestoes");

            migrationBuilder.DropTable(
                name: "Exercicios");

            migrationBuilder.DropTable(
                name: "RequisicoesSugestao");

            migrationBuilder.DropTable(
                name: "PerfisUsuarios");
        }
    }
}
