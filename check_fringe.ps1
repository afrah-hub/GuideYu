Add-Type -AssemblyName System.Drawing
$imagePath = "C:\Users\afrah\Documents\SingleProject\GuideYu\public\brand logo.png"
if (Test-Path $imagePath) {
    $image = [System.Drawing.Bitmap]::FromFile($imagePath)
    $nonTransparentCount = 0
    $fringeCount = 0
    for ($y = 0; $y -lt 10; $y++) {
        for ($x = 0; $x -lt 10; $x++) {
            $p = $image.GetPixel($x, $y)
            if ($p.A -ne 0) {
                Write-Host "Pixel at $x, $y is not transparent: R$($p.R) G$($p.G) B$($p.B) A$($p.A)"
                $nonTransparentCount++
            }
        }
    }
    Write-Host "Total non-transparent in top-left 10x10: $nonTransparentCount"
    $image.Dispose()
}
