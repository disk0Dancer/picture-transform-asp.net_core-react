using System.Drawing;
using System.Drawing.Imaging;
using System.Net;
using Microsoft.AspNetCore.Mvc;
using picture_transform_asp.net_core_react.Models;

namespace picture_transform_asp.net_core_react.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PictureTransformController : Controller
{
    private readonly ILogger<T> _logger;

    public PictureTransformController(ILogger<T> logger)
    {
        _logger = logger;
    }
    
    [HttpPost]
    public IActionResult GenerateAndSendFragments([FromBody] FormRequest request)
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
                using (var image = Image.FromStream(stream))
                {
                    int fragmentWidth = image.Width / columns;
                    int fragmentHeight = image.Height / rows;

                    List<FormResult> fragments = new List<FormResult>();

                    // Создание директории для сохранения фрагментов
                    string directoryPath = Path.Combine("wwwroot", "image-fragments", Guid.NewGuid().ToString());
                    Directory.CreateDirectory(directoryPath);// add datetime

                    for (int row = 0; row < rows; ++row)
                    {
                        for (int col = 0; col < columns; ++col)
                        {
                            int x = col * fragmentWidth;
                            int y = row * fragmentHeight;

                            using (var croppedImage = CropImage(image, x, y, fragmentWidth, fragmentHeight))
                            {
                                // Сохранение фрагмента в файл
                                string fragmentFileName = $"{row}_{col}.png";
                                string fragmentFilePath = Path.Combine(directoryPath, fragmentFileName);
                                croppedImage.Save(fragmentFilePath, ImageFormat.Png);

                                fragments.Add(new FormResult()
                                {
                                    Row = row,
                                    Column = col,
                                    Uri = $"/image-fragments/{directoryPath}/{fragmentFileName}"
                                });
                            }
                        }
                    }

                    return Ok(fragments);
                }
            }
        }
        catch (Exception ex)
        {
            return BadRequest($"Error: {ex.Message}");
        }
    }
    
    // Метод для вырезания фрагмента изображения
    private Image CropImage(Image img, int x, int y, int width, int height)
    {
        var bmp = new Bitmap(width, height);
        bmp.SetResolution(img.HorizontalResolution, img.VerticalResolution);

        using (var g = Graphics.FromImage(bmp))
        {
            g.DrawImage(img, new Rectangle(0, 0, width, height), new Rectangle(x, y, width, height), GraphicsUnit.Pixel);
        }

        return bmp;
    }
}