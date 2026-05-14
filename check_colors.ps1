Add-Type -AssemblyName System.Drawing
$imagePath = "C:\Users\afrah\Documents\SingleProject\GuideYu\public\brand logo.png"
if (Test-Path $imagePath) {
    $image = [System.Drawing.Bitmap]::FromFile($imagePath)
    $nearWhiteCount = 0
    $nearBlackCount = 0
    $otherCount = 0
    for ($y = 0; $y -lt $image.Height; $y+=5) {
        for ($x = 0; $x -lt $image.Width; $x+=5) {
            $p = $image.GetPixel($x, $y)
            if ($p.A -ne 0) {
                if ($p.R -gt 240 -and $p.G -gt 240 -and $p.B -gt 240) {
                    $nearWhiteCount++
                } elseif ($p.R -lt 15 -and $p.G -lt 15 -and $p.B -lt 15) {
                    $nearBlackCount++
                } else {
                    $otherCount++
                }
            }
        }
    }
    Write-Host "Near White: $nearWhiteCount, Near Black: $nearBlackCount, Other: $otherCount"
    $image.Dispose()
}
