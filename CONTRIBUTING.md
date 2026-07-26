# Contributing to SENPAI Projects

## CSC / OAUSTECH Compliance

All project reports must follow the **Department of Computer Science B.Sc. Guidelines for Undergraduate Project Write-Up**.

### Formatting
- **Font:** Times New Roman 12pt throughout
- **Paper:** A4 (210mm x 297mm)
- **Margins:** Left 40mm, Top/Bottom/Right 25mm
- **Spacing:** Exactly 1.5 line spacing
- **Alignment:** Justified body text

### Preliminary Pages (Roman numerals: i, ii, iii...)
1. Title Page — **unnumbered**
2. Certification
3. Declaration
4. Dedication
5. Acknowledgements
6. Abstract
7. Table of Contents
8. List of Figures
9. List of Tables
10. List of Abbreviations

### Main Body (Arabic numerals: 1, 2, 3...)
- **Chapter 1:** Introduction
- **Chapter 2:** Literature Review
- **Chapter 3:** Methodology
- **Chapter 4:** System Implementation, Results and Discussion
- **Chapter 5:** Summary, Conclusion and Recommendations
- **References** (APA style)
- **Appendix** (if any)

### Slide Deck
- Exactly 12 slides
- Black-and-white theme only
- Title, 10 content slides, Thank You

## Build Process

### 1. Set up environment
```bash
pip install python-docx python-pptx playwright
playwright install chromium
```

### 2. Take screenshots
```bash
python shots/capture_<project>.py
```
Screenshots saved to `shots/<project>/`.

### 3. Generate report
```bash
python build_<project>_report.py
```
Output: `<Project>_Report.docx`

### 4. Generate slides
```bash
python build_slides.py
```
Output: `<Project>_Defence_Slides.pptx`

### 5. Convert to PDF
```bash
powershell -File convert_all_pdf.ps1
```

## Quality Checklist

- [ ] All chapters completed (1-5)
- [ ] Preliminary pages complete with correct numbering
- [ ] Title page has no page number
- [ ] TOC auto-updates correctly
- [ ] References in correct APA format with hanging indent
- [ ] Screenshots included and properly captioned
- [ ] All references are genuine and verifiable
- [ ] Report compiles without errors
- [ ] Slides follow 12-slide black-and-white format
- [ ] No placeholder text remaining

## Code Style

- Python: PEP 8
- `report_helpers.py` shared helpers should be reused (not duplicated)
- File paths use raw strings or `os.path.join`
- No hardcoded student names in shared modules

## Git Workflow

- Commit messages: `type: description`
- Push directly to `main` for final deliverables
- Branch `dev/<feature>` for in-progress work
