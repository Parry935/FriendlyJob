using Microsoft.EntityFrameworkCore.Migrations;

namespace api_server.Migrations
{
    public partial class ChangeEnumPropInOffersModels : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Contract",
                table: "ProgrammerOffers",
                newName: "Contracts");

            migrationBuilder.RenameColumn(
                name: "Contract",
                table: "JobOffers",
                newName: "Contracts");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Contracts",
                table: "ProgrammerOffers",
                newName: "Contract");

            migrationBuilder.RenameColumn(
                name: "Contracts",
                table: "JobOffers",
                newName: "Contract");
        }
    }
}
