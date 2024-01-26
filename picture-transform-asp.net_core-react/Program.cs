if (Directory.Exists(Path.Combine("ClientApp", "public", "image-fragments")))
{
    Directory.Delete(Path.Combine("ClientApp", "public", "image-fragments"),true);
} 

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllersWithViews();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}
app.UseCors(builder =>
{
    builder.WithOrigins("https://127.0.0.1:44432")
        .AllowAnyMethod()
        .AllowAnyHeader();
});

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();


app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html");

app.Run();