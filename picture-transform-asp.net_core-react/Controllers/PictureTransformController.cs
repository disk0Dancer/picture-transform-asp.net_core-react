using System.Net;
using Microsoft.AspNetCore.Mvc;
using picture_transform_asp.net_core_react.Models;

using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;
using SixLabors.ImageSharp.Formats.Png;

using SixLabors.Fonts;
using SixLabors.ImageSharp.Drawing.Processing;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Processing;

namespace picture_transform_asp.net_core_react.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PictureTransformController : Controller
{
    private readonly ILogger<string> _logger;

    public PictureTransformController(ILogger<string> logger)
    {
        _logger = logger;
    }

    private Image CropImage(Image image, int x, int y, int width, int height)
    {
        return image
            .Clone(ctx => ctx
                .Crop(new Rectangle(x, y, width, height)));
    }

    private async void AddCoordinates(Image image, int x, int y)
    {
        float textPadding = 18f;
        string text = $"{x},{y}";
        
        var font = SystemFonts.CreateFont("Arial", 14f, FontStyle.Regular);
        var options = new TextOptions(font)
        {
            Dpi = 72,
            KerningMode = KerningMode.Standard
        };

        var rect = TextMeasurer.MeasureSize(text, options);
        
        image.Mutate(ctx => ctx.DrawText($"{x},{y}", font, Color.Red, new PointF(0, 0)));
    }

    [HttpPost]
    public async Task<IEnumerable<string>> GetFragments([FromBody] FormRequest request)
    { 
        try
        {
            string imageUrl = request.ImageUrl;
            int rows = request.Rows;
            int columns = request.Columns;
              
            using (var webClient = new WebClient())
            { 
                byte[] imageData = webClient.DownloadData(imageUrl);
                using (var stream = new MemoryStream(imageData)) 
                using (var image = Image.Load(stream)) 
                {
                    int fragmentWidth = image.Width / columns;
                    int fragmentHeight = image.Height / rows;

                    List<string> fragments = new List<string>();

                    // Создание директории для сохранения фрагментов
                    string guid = Guid.NewGuid().ToString();
                    string directoryPath = Path.Combine("ClientApp", "public", "image-fragments", guid);
                    Directory.CreateDirectory(directoryPath);

                    for (int row = 0; row < rows; row++) 
                    {
                        for (int col = 0; col < columns; col++) 
                        { 
                            int x = col * fragmentWidth; 
                            int y = row * fragmentHeight;
                            
                            using (var croppedImage = CropImage(image, x, y, fragmentWidth, fragmentHeight)) 
                            { 
                                // Сохранение фрагмента в файл
                                AddCoordinates(croppedImage, x, y);
                                string fragmentFileName = $"{row}_{col}.png";
                                string fragmentFilePath = Path.Combine(directoryPath, fragmentFileName);
                                croppedImage.SaveAsync(fragmentFilePath, new PngEncoder());

                                fragments.Add($"./image-fragments/{guid}/{fragmentFileName}");
                            }
                        }
                    }
                    return fragments.ToArray();
                }
            }
        }
        catch (Exception ex)
        { 
            Console.WriteLine(ex); 
            return null;
        }
    }

    
    [HttpOptions]
    public IActionResult Options()
    {
        Response.Headers.Add("Access-Control-Allow-Origin", "https://127.0.0.1:44432");// TODO chreck IP
        Response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        Response.Headers.Add("Access-Control-Allow-Headers", "Content-Type");
        return Ok();
    }

}