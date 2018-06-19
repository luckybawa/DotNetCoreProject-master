using System;
using Core.Common.Utilities;
using Microsoft.EntityFrameworkCore.Migrations;

namespace DotNetCoreWebApp.Migrations
{
    public partial class AddCommonColumns : Migration
    {

        string[] tableNames = { "Album", "Artist", "Customer", "Employee", "Genre", "Invoice", "InvoiceLine", "MediaType", "Playlist", "PlaylistTrack", "Track" };
        protected override void Up(MigrationBuilder migrationBuilder)
        {


            foreach (string tableName in tableNames)
            {
                migrationBuilder.AddColumn<DateTime>(name: "DateCreated", table: tableName, nullable: false, defaultValue: new DateTime(2016, 8, 15, 10, 12, 29, 904, DateTimeKind.Local));
                migrationBuilder.AddColumn<DateTime>(name: "DateModified", table: tableName, nullable: false, defaultValue: new DateTime(2016, 8, 15, 10, 12, 29, 904, DateTimeKind.Local));
                migrationBuilder.AddColumn<bool>(name: "Deleted", table: tableName, nullable: false, defaultValue: false);
                migrationBuilder.AddColumn<string>(name: "Guid", table: tableName, nullable: false, defaultValue: StringUtils.GenerateLowercase32DigitsGuid());
                migrationBuilder.AddColumn<byte[]>(name: "RowVersion", table: tableName, nullable: false, defaultValue: DateTime.Now.Millisecond);
            
            }

        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            foreach (string tableName in tableNames)
            {
                migrationBuilder.DropColumn("DateCreated", tableName);
                migrationBuilder.DropColumn("DateModified", tableName);
                migrationBuilder.DropColumn("Deleted", tableName);
                migrationBuilder.DropColumn("Guid", tableName);
                migrationBuilder.DropColumn("RowVersion", tableName);
            }
        }
        /*
        protected override void Up(MigrationBuilder migrationBuilder)
        {

            

            
            migrationBuilder.CreateTable(
                name: "Artist",
                columns: table => new
                {
                    ArtistId = table.Column<long>(nullable: false)
                        .Annotation("Autoincrement", true),
                    DateCreated = table.Column<DateTime>(nullable: false),
                    DateModified = table.Column<DateTime>(nullable: false),
                    Deleted = table.Column<bool>(nullable: true),
                    Guid = table.Column<string>(nullable: true),
                    Id = table.Column<int>(nullable: false),
                    Name = table.Column<string>(type: "NVARCHAR(120)", nullable: true),
                    ObjectState = table.Column<int>(nullable: false),
                    RowVersion = table.Column<byte[]>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Artist", x => x.ArtistId);
                });

            migrationBuilder.CreateTable(
                name: "Employee",
                columns: table => new
                {
                    EmployeeId = table.Column<long>(nullable: false)
                        .Annotation("Autoincrement", true),
                    Address = table.Column<string>(type: "NVARCHAR(70)", nullable: true),
                    BirthDate = table.Column<string>(type: "DATETIME", nullable: true),
                    City = table.Column<string>(type: "NVARCHAR(40)", nullable: true),
                    Country = table.Column<string>(type: "NVARCHAR(40)", nullable: true),
                    DateCreated = table.Column<DateTime>(nullable: false),
                    DateModified = table.Column<DateTime>(nullable: false),
                    Deleted = table.Column<bool>(nullable: true),
                    Email = table.Column<string>(type: "NVARCHAR(60)", nullable: true),
                    Fax = table.Column<string>(type: "NVARCHAR(24)", nullable: true),
                    FirstName = table.Column<string>(type: "NVARCHAR(20)", nullable: false),
                    Guid = table.Column<string>(nullable: true),
                    HireDate = table.Column<string>(type: "DATETIME", nullable: true),
                    Id = table.Column<int>(nullable: false),
                    LastName = table.Column<string>(type: "NVARCHAR(20)", nullable: false),
                    ObjectState = table.Column<int>(nullable: false),
                    Phone = table.Column<string>(type: "NVARCHAR(24)", nullable: true),
                    PostalCode = table.Column<string>(type: "NVARCHAR(10)", nullable: true),
                    ReportsTo = table.Column<long>(nullable: true),
                    RowVersion = table.Column<byte[]>(nullable: true),
                    State = table.Column<string>(type: "NVARCHAR(40)", nullable: true),
                    Title = table.Column<string>(type: "NVARCHAR(30)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Employee", x => x.EmployeeId);
                    table.ForeignKey(
                        name: "FK_Employee_Employee_ReportsTo",
                        column: x => x.ReportsTo,
                        principalTable: "Employee",
                        principalColumn: "EmployeeId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Genre",
                columns: table => new
                {
                    GenreId = table.Column<long>(nullable: false)
                        .Annotation("Autoincrement", true),
                    DateCreated = table.Column<DateTime>(nullable: false),
                    DateModified = table.Column<DateTime>(nullable: false),
                    Deleted = table.Column<bool>(nullable: true),
                    Guid = table.Column<string>(nullable: true),
                    Id = table.Column<int>(nullable: false),
                    Name = table.Column<string>(type: "NVARCHAR(120)", nullable: true),
                    ObjectState = table.Column<int>(nullable: false),
                    RowVersion = table.Column<byte[]>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Genre", x => x.GenreId);
                });

            migrationBuilder.CreateTable(
                name: "MediaType",
                columns: table => new
                {
                    MediaTypeId = table.Column<long>(nullable: false)
                        .Annotation("Autoincrement", true),
                    DateCreated = table.Column<DateTime>(nullable: false),
                    DateModified = table.Column<DateTime>(nullable: false),
                    Deleted = table.Column<bool>(nullable: true),
                    Guid = table.Column<string>(nullable: true),
                    Id = table.Column<int>(nullable: false),
                    Name = table.Column<string>(type: "NVARCHAR(120)", nullable: true),
                    ObjectState = table.Column<int>(nullable: false),
                    RowVersion = table.Column<byte[]>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MediaType", x => x.MediaTypeId);
                });

            migrationBuilder.CreateTable(
                name: "Playlist",
                columns: table => new
                {
                    PlaylistId = table.Column<long>(nullable: false)
                        .Annotation("Autoincrement", true),
                    DateCreated = table.Column<DateTime>(nullable: false),
                    DateModified = table.Column<DateTime>(nullable: false),
                    Deleted = table.Column<bool>(nullable: true),
                    Guid = table.Column<string>(nullable: true),
                    Id = table.Column<int>(nullable: false),
                    Name = table.Column<string>(type: "NVARCHAR(120)", nullable: true),
                    ObjectState = table.Column<int>(nullable: false),
                    RowVersion = table.Column<byte[]>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Playlist", x => x.PlaylistId);
                });

            migrationBuilder.CreateTable(
                name: "Album",
                columns: table => new
                {
                    AlbumId = table.Column<long>(nullable: false)
                        .Annotation("Autoincrement", true),
                    ArtistId = table.Column<long>(nullable: false),
                    DateCreated = table.Column<DateTime>(nullable: false),
                    DateModified = table.Column<DateTime>(nullable: false),
                    Deleted = table.Column<bool>(nullable: true),
                    Guid = table.Column<string>(nullable: true),
                    Id = table.Column<int>(nullable: false),
                    ObjectState = table.Column<int>(nullable: false),
                    RowVersion = table.Column<byte[]>(nullable: true),
                    Title = table.Column<string>(type: "NVARCHAR(160)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Album", x => x.AlbumId);
                    table.ForeignKey(
                        name: "FK_Album_Artist_ArtistId",
                        column: x => x.ArtistId,
                        principalTable: "Artist",
                        principalColumn: "ArtistId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Customer",
                columns: table => new
                {
                    CustomerId = table.Column<long>(nullable: false)
                        .Annotation("Autoincrement", true),
                    Address = table.Column<string>(type: "NVARCHAR(70)", nullable: true),
                    City = table.Column<string>(type: "NVARCHAR(40)", nullable: true),
                    Company = table.Column<string>(type: "NVARCHAR(80)", nullable: true),
                    Country = table.Column<string>(type: "NVARCHAR(40)", nullable: true),
                    DateCreated = table.Column<DateTime>(nullable: false),
                    DateModified = table.Column<DateTime>(nullable: false),
                    Deleted = table.Column<bool>(nullable: true),
                    Email = table.Column<string>(type: "NVARCHAR(60)", nullable: false),
                    Fax = table.Column<string>(type: "NVARCHAR(24)", nullable: true),
                    FirstName = table.Column<string>(type: "NVARCHAR(40)", nullable: false),
                    Guid = table.Column<string>(nullable: true),
                    Id = table.Column<int>(nullable: false),
                    LastName = table.Column<string>(type: "NVARCHAR(20)", nullable: false),
                    ObjectState = table.Column<int>(nullable: false),
                    Phone = table.Column<string>(type: "NVARCHAR(24)", nullable: true),
                    PostalCode = table.Column<string>(type: "NVARCHAR(10)", nullable: true),
                    RowVersion = table.Column<byte[]>(nullable: true),
                    State = table.Column<string>(type: "NVARCHAR(40)", nullable: true),
                    SupportRepId = table.Column<long>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Customer", x => x.CustomerId);
                    table.ForeignKey(
                        name: "FK_Customer_Employee_SupportRepId",
                        column: x => x.SupportRepId,
                        principalTable: "Employee",
                        principalColumn: "EmployeeId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Track",
                columns: table => new
                {
                    TrackId = table.Column<long>(nullable: false)
                        .Annotation("Autoincrement", true),
                    AlbumId = table.Column<long>(nullable: true),
                    Bytes = table.Column<long>(nullable: true),
                    Composer = table.Column<string>(type: "NVARCHAR(220)", nullable: true),
                    DateCreated = table.Column<DateTime>(nullable: false),
                    DateModified = table.Column<DateTime>(nullable: false),
                    Deleted = table.Column<bool>(nullable: true),
                    GenreId = table.Column<long>(nullable: true),
                    Guid = table.Column<string>(nullable: true),
                    Id = table.Column<int>(nullable: false),
                    MediaTypeId = table.Column<long>(nullable: false),
                    Milliseconds = table.Column<long>(nullable: false),
                    Name = table.Column<string>(type: "NVARCHAR(200)", nullable: false),
                    ObjectState = table.Column<int>(nullable: false),
                    RowVersion = table.Column<byte[]>(nullable: true),
                    UnitPrice = table.Column<string>(type: "NUMERIC(10,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Track", x => x.TrackId);
                    table.ForeignKey(
                        name: "FK_Track_Album_AlbumId",
                        column: x => x.AlbumId,
                        principalTable: "Album",
                        principalColumn: "AlbumId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Track_Genre_GenreId",
                        column: x => x.GenreId,
                        principalTable: "Genre",
                        principalColumn: "GenreId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Track_MediaType_MediaTypeId",
                        column: x => x.MediaTypeId,
                        principalTable: "MediaType",
                        principalColumn: "MediaTypeId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Invoice",
                columns: table => new
                {
                    InvoiceId = table.Column<long>(nullable: false)
                        .Annotation("Autoincrement", true),
                    BillingAddress = table.Column<string>(type: "NVARCHAR(70)", nullable: true),
                    BillingCity = table.Column<string>(type: "NVARCHAR(40)", nullable: true),
                    BillingCountry = table.Column<string>(type: "NVARCHAR(40)", nullable: true),
                    BillingPostalCode = table.Column<string>(type: "NVARCHAR(10)", nullable: true),
                    BillingState = table.Column<string>(type: "NVARCHAR(40)", nullable: true),
                    CustomerId = table.Column<long>(nullable: false),
                    DateCreated = table.Column<DateTime>(nullable: false),
                    DateModified = table.Column<DateTime>(nullable: false),
                    Deleted = table.Column<bool>(nullable: true),
                    Guid = table.Column<string>(nullable: true),
                    Id = table.Column<int>(nullable: false),
                    InvoiceDate = table.Column<string>(type: "DATETIME", nullable: false),
                    ObjectState = table.Column<int>(nullable: false),
                    RowVersion = table.Column<byte[]>(nullable: true),
                    Total = table.Column<string>(type: "NUMERIC(10,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Invoice", x => x.InvoiceId);
                    table.ForeignKey(
                        name: "FK_Invoice_Customer_CustomerId",
                        column: x => x.CustomerId,
                        principalTable: "Customer",
                        principalColumn: "CustomerId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "PlaylistTrack",
                columns: table => new
                {
                    PlaylistId = table.Column<long>(nullable: false),
                    TrackId = table.Column<long>(nullable: false),
                    DateCreated = table.Column<DateTime>(nullable: false),
                    DateModified = table.Column<DateTime>(nullable: false),
                    Deleted = table.Column<bool>(nullable: true),
                    Guid = table.Column<string>(nullable: true),
                    Id = table.Column<int>(nullable: false),
                    ObjectState = table.Column<int>(nullable: false),
                    RowVersion = table.Column<byte[]>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("sqlite_autoindex_PlaylistTrack_1", x => new { x.PlaylistId, x.TrackId });
                    table.ForeignKey(
                        name: "FK_PlaylistTrack_Playlist_PlaylistId",
                        column: x => x.PlaylistId,
                        principalTable: "Playlist",
                        principalColumn: "PlaylistId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PlaylistTrack_Track_TrackId",
                        column: x => x.TrackId,
                        principalTable: "Track",
                        principalColumn: "TrackId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "InvoiceLine",
                columns: table => new
                {
                    InvoiceLineId = table.Column<long>(nullable: false)
                        .Annotation("Autoincrement", true),
                    DateCreated = table.Column<DateTime>(nullable: false),
                    DateModified = table.Column<DateTime>(nullable: false),
                    Deleted = table.Column<bool>(nullable: true),
                    Guid = table.Column<string>(nullable: true),
                    Id = table.Column<int>(nullable: false),
                    InvoiceId = table.Column<long>(nullable: false),
                    ObjectState = table.Column<int>(nullable: false),
                    Quantity = table.Column<long>(nullable: false),
                    RowVersion = table.Column<byte[]>(nullable: true),
                    TrackId = table.Column<long>(nullable: false),
                    UnitPrice = table.Column<string>(type: "NUMERIC(10,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InvoiceLine", x => x.InvoiceLineId);
                    table.ForeignKey(
                        name: "FK_InvoiceLine_Invoice_InvoiceId",
                        column: x => x.InvoiceId,
                        principalTable: "Invoice",
                        principalColumn: "InvoiceId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_InvoiceLine_Track_TrackId",
                        column: x => x.TrackId,
                        principalTable: "Track",
                        principalColumn: "TrackId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IFK_AlbumArtistId",
                table: "Album",
                column: "ArtistId");

            migrationBuilder.CreateIndex(
                name: "IFK_CustomerSupportRepId",
                table: "Customer",
                column: "SupportRepId");

            migrationBuilder.CreateIndex(
                name: "IFK_EmployeeReportsTo",
                table: "Employee",
                column: "ReportsTo");

            migrationBuilder.CreateIndex(
                name: "IFK_InvoiceCustomerId",
                table: "Invoice",
                column: "CustomerId");

            migrationBuilder.CreateIndex(
                name: "IFK_InvoiceLineInvoiceId",
                table: "InvoiceLine",
                column: "InvoiceId");

            migrationBuilder.CreateIndex(
                name: "IFK_InvoiceLineTrackId",
                table: "InvoiceLine",
                column: "TrackId");

            migrationBuilder.CreateIndex(
                name: "IX_PlaylistTrack_PlaylistId",
                table: "PlaylistTrack",
                column: "PlaylistId");

            migrationBuilder.CreateIndex(
                name: "IFK_PlaylistTrackTrackId",
                table: "PlaylistTrack",
                column: "TrackId");

            migrationBuilder.CreateIndex(
                name: "IFK_TrackAlbumId",
                table: "Track",
                column: "AlbumId");

            migrationBuilder.CreateIndex(
                name: "IFK_TrackGenreId",
                table: "Track",
                column: "GenreId");

            migrationBuilder.CreateIndex(
                name: "IFK_TrackMediaTypeId",
                table: "Track",
                column: "MediaTypeId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "InvoiceLine");

            migrationBuilder.DropTable(
                name: "PlaylistTrack");

            migrationBuilder.DropTable(
                name: "Invoice");

            migrationBuilder.DropTable(
                name: "Playlist");

            migrationBuilder.DropTable(
                name: "Track");

            migrationBuilder.DropTable(
                name: "Customer");

            migrationBuilder.DropTable(
                name: "Album");

            migrationBuilder.DropTable(
                name: "Genre");

            migrationBuilder.DropTable(
                name: "MediaType");

            migrationBuilder.DropTable(
                name: "Employee");

            migrationBuilder.DropTable(
                name: "Artist");
        }
        */
    }
}
