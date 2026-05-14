Add-Type -AssemblyName System.Drawing
$imagePath = "C:\Users\afrah\Documents\SingleProject\GuideYu\public\brand logo.png"
if (Test-Path $imagePath) {
    $image = [System.Drawing.Bitmap]::FromFile($imagePath)
    $hasTransparent = $false
    for ($y = 0; $y -lt $image.Height; $y += 50) {
        for ($x = 0; $x -lt $image.Width; $x += 50) {
            if ($image.GetPixel($x, $y).A -eq 0) {
                $hasTransparent = $true
                break
            }
        }
        if ($hasTransparent) { break }
    }
    Write-Host "Width: $($image.Width), Height: $($image.Height)"
    Write-Host "Has fully transparent pixels: $hasTransparent"
    Write-Host "Top-Left Color: $($image.GetPixel(0,0).R), $($image.GetPixel(0,0).G), $($image.GetPixel(0,0).B), A: $($image.GetPixel(0,0).A)"
    $image.Dispose()
} else {
    Write-Host "File not found"
}
