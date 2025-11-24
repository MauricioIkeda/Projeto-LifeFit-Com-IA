using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LifeFit.Dominio.Migrations
{
    /// <inheritdoc />
    public partial class Idade : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DataNascimento",
                table: "PerfisUsuarios");

            migrationBuilder.AddColumn<int>(
                name: "Idade",
                table: "PerfisUsuarios",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Idade",
                table: "PerfisUsuarios");

            migrationBuilder.AddColumn<DateTime>(
                name: "DataNascimento",
                table: "PerfisUsuarios",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }
    }
}
