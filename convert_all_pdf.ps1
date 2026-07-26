# Convert both reports to PDF via Word, updating TOC/fields first.
$pairs = @(
  @{ src = "c:\Users\ALEXIS\Desktop\SENPAI\mayor4code_Project_Report.docx"; pdf = "c:\Users\ALEXIS\Desktop\SENPAI\mayor4code_Project_Report.pdf" },
  @{ src = "c:\Users\ALEXIS\Desktop\SENPAI\AgriFlow_AI_Project_Report.docx"; pdf = "c:\Users\ALEXIS\Desktop\SENPAI\AgriFlow_AI_Project_Report.pdf" },
  @{ src = "c:\Users\ALEXIS\Desktop\SENPAI\ids_Project_Report.docx"; pdf = "c:\Users\ALEXIS\Desktop\SENPAI\ids_Project_Report.pdf" }
)
$word = New-Object -ComObject Word.Application
$word.Visible = $false
foreach ($p in $pairs) {
  $doc = $word.Documents.Open($p.src, $false, $false)
  foreach ($story in $doc.StoryRanges) { $null = $story.Fields.Update() }
  if ($doc.TablesOfContents.Count -gt 0) {
    for ($i = 1; $i -le $doc.TablesOfContents.Count; $i++) { $doc.TablesOfContents.Item($i).Update() }
  }
  $null = $doc.Fields.Update()
  $doc.SaveAs([ref]$p.pdf, [ref]17)
  $doc.Close($false)
  Write-Output ("PDF saved: " + $p.pdf)
}
$word.Quit()
