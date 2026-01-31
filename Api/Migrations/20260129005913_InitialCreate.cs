using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace YotsubaWebApi.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    DiscordUserId = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    Username = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    Avatar = table.Column<string>(type: "TEXT", maxLength: 500, nullable: false),
                    LinkedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    AccountStatus = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "DiscordSessions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    UserId = table.Column<Guid>(type: "TEXT", nullable: false),
                    DiscordUserId = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    AccessToken = table.Column<string>(type: "TEXT", maxLength: 500, nullable: false),
                    RefreshToken = table.Column<string>(type: "TEXT", maxLength: 500, nullable: false),
                    TokenExpiresAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    LastUsedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    IsRevoked = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DiscordSessions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DiscordSessions_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DiscordSessions_UserId",
                table: "DiscordSessions",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_DiscordUserId",
                table: "Users",
                column: "DiscordUserId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DiscordSessions");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
