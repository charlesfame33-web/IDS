# SENPAI Workspace

Monorepo for B.Sc. Computer Science projects — Olusegun Agagu University of Science and Technology (OAUSTECH), Okitipupa.

## Projects

| Project | Description | Student | Matric |
|---------|-------------|---------|--------|
| **ids-project** | AI-Based Intrusion Detection System for Encrypted Traffic | Oyeduntan Segun Elijah | CSC/22/174 |
| **agriflow** | AI-Driven Agricultural Supply Chain and Produce Scheduling System | Obayomi Samuel Oluwagbotemi | CSC/22/124 |
| **testapp** | mayor4code E-Learning Platform | Giwa Mayowa Bopoola | CSC/22/204 |
| **senpai-app** | SENPAI Main Application | — | — |

## Workspace Structure

```
SENPAI/
├── <project>/               # Project root
├── shots/                   # All screenshots
│   ├── <project>/           # Per-project screenshots
├── _archive/                # Deprecated / old files
├── <Project>_Report.docx    # Generated B.Sc. reports
├── <Project>_Defence_Slides.pptx  # Generated defence slides
├── build_<project>_report.py      # Report builder scripts
├── build_slides.py               # Unified slides builder
├── report_helpers.py             # Shared report formatting helpers
├── convert_all_pdf.ps1           # PDF conversion script
├── README.md                     # This file
├── CLAUDE.md                     # AI/conventions rules
├── CONTRIBUTING.md               # Contributor guidelines
```

## Build Commands

```bash
# Generate project report
python build_<project>_report.py

# Generate defence slides
python build_slides.py

# Convert all .docx to PDF
powershell -File convert_all_pdf.ps1
```

## Standards

All reports follow CSC / OAUSTECH B.Sc. guidelines:
- Times New Roman 12pt, A4, 1.5 line spacing
- Preliminary pages: Roman numerals (title page unnumbered)
- Main body: Arabic numerals starting at 1
- Chapters: Introduction, Literature Review, Methodology, Implementation & Results, Summary & Conclusion
- References: APA style with hanging indent

All slides follow the standard 12-slide black-and-white defence format.

## License

Academic — for educational and research purposes.
