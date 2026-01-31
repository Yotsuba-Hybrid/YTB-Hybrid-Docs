using Microsoft.EntityFrameworkCore;
using YotsubaWebApi.Domain;

namespace YotsubaWebApi.Infrastructure;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<DiscordSession> DiscordSessions => Set<DiscordSession>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.DiscordUserId).IsUnique();
            entity.Property(e => e.Username).IsRequired().HasMaxLength(100);
            entity.Property(e => e.DiscordUserId).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Avatar).HasMaxLength(500);
            entity.Property(e => e.AccountStatus).HasMaxLength(50);
        });

        modelBuilder.Entity<DiscordSession>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.UserId);
            entity.Property(e => e.DiscordUserId).IsRequired().HasMaxLength(50);
            entity.Property(e => e.AccessToken).IsRequired().HasMaxLength(500);
            entity.Property(e => e.RefreshToken).IsRequired().HasMaxLength(500);

            entity.HasOne(e => e.User)
                  .WithMany()
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
