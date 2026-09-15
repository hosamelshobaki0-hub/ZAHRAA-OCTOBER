$workspace = 'c:\Users\hosam\Desktop\zahraa-transport'
$files = Get-ChildItem -Path $workspace -Recurse -Filter '*.html' -File
$updated = 0

foreach ($file in $files) {
    $text = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
    $original = $text

    $text = $text.Replace('Zahraa Transport', 'منصة زهراء أكتوبر الرقمية')
    $text = $text.Replace('Zahraa Transport Admin', 'منصة زهراء أكتوبر الرقمية')
    $text = $text.Replace('Zahraa Transport - Driver', 'منصة زهراء أكتوبر الرقمية')
    $text = $text.Replace('زهراء <span>ترانسپورت</span>', 'منصة <span>زهراء أكتوبر الرقمية</span>')
    $text = $text.Replace('زهراء ترانسپورت', 'منصة زهراء أكتوبر الرقمية')

    if ($text -ne $original) {
        [System.IO.File]::WriteAllText($file.FullName, $text, [System.Text.Encoding]::UTF8)
        $updated++
    }
}

Write-Host ('updated_brand_pages=' + $updated)
