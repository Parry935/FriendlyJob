using Microsoft.EntityFrameworkCore.Migrations;

namespace api_server.Migrations
{
    public partial class AddAnonymousPropToOpinonModel : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Anonymous",
                table: "Opinions",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Anonymous",
                table: "Opinions");
        }
    }
}
