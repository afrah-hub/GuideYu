Add-Type -AssemblyName System.Drawing
$imagePath = "C:\Users\afrah\Documents\SingleProject\GuideYu\public\brand logo.png"
if (Test-Path $imagePath) {
    $image = [System.Drawing.Bitmap]::FromFile($imagePath)
    $clone = New-Object System.Drawing.Bitmap($image.Width, $image.Height)
    $graphics = [System.Drawing.Graphics]::FromImage($clone)
    $graphics.DrawImage($image, 0, 0)
    $image.Dispose()
    $graphics.Dispose()
    
    # We found the background is around R34 G30 B39
    $bgR = 34
    $bgG = 30
    $bgB = 39
    
    $threshold1 = 25 # Colors within this distance become fully transparent
    $threshold2 = 80 # Colors beyond this remain fully opaque
    
    for ($y = 0; $y -lt $clone.Height; $y++) {
        for ($x = 0; $x -lt $clone.Width; $x++) {
            $p = $clone.GetPixel($x, $y)
            if ($p.A -ne 0) {
                # Calculate color distance
                $dR = $p.R - $bgR
                $dG = $p.G - $bgG
                $dB = $p.B - $bgB
                $dist = [Math]::Sqrt($dR*$dR + $dG*$dG + $dB*$dB)
                
                if ($dist -lt $threshold1) {
                    $clone.SetPixel($x, $y, [System.Drawing.Color]::Transparent)
                } elseif ($dist -lt $threshold2) {
                    # Feathering
                    $factor = ($dist - $threshold1) / ($threshold2 - $threshold1)
                    $newA = [int](255 * $factor)
                    if ($newA -lt 0) { $newA = 0 }
                    if ($newA -gt 255) { $newA = 255 }
                    $newColor = [System.Drawing.Color]::FromArgb($newA, $p.R, $p.G, $p.B)
                    $clone.SetPixel($x, $y, $newColor)
                }
            }
        }
    }
    
    $clone.Save($imagePath, [System.Drawing.Imaging.ImageFormat]::Png)
    $clone.Dispose()
    Write-Host "Chroma key background removal completed."
} else {
    Write-Host "File not found."
}
