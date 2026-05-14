Add-Type -AssemblyName System.Drawing
$imagePath = "C:\Users\afrah\Documents\SingleProject\GuideYu\public\brand logo.png"
if (Test-Path $imagePath) {
    $image = [System.Drawing.Bitmap]::FromFile($imagePath)
    $samples = 0
    for ($y = 0; $y -lt $image.Height; $y+=20) {
        for ($x = 0; $x -lt $image.Width; $x+=20) {
            $p = $image.GetPixel($x, $y)
            if ($p.A -ne 0) {
                Write-Host "Color: R$($p.R) G$($p.G) B$($p.B) A$($p.A)"
                $samples++
                if ($samples -ge 10) { break }
            }
        }
        if ($samples -ge 10) { break }
    }
    $image.Dispose()
}
