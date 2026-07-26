# Convert the report to PDF via Word, updating TOC/fields first.
$src = "c:\Users\ALEXIS\Desktop\SENPAI\mayor4code_Project_Report.docx"
$pdf = "c:\Users\ALEXIS\Desktop\SENPAI\mayor4code_Project_Report.pdf"

$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Open($src, $false, $true)  # confirmconversions, readonly=false

# Update all fields (TOC) and any table-of-contents objects
foreach ($story in $doc.StoryRanges) { $null = $story.Fields.Update() }
if ($doc.TablesOfContents.Count -gt 0) {
    for ($i = 1; $i -le $doc.TablesOfContents.Count; $i++) { $doc.TablesOfContents.Item($i).Update() }
}
$null = $doc.Fields.Update()

# Export to PDF (17 = wdFormatPDF)
$doc.SaveAs([ref]$pdf, [ref]17)
$doc.Close($false)
$word.Quit()
Write-Output "PDF saved: $pdf"
