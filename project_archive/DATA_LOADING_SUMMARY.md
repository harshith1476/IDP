# Data Loading Summary

This document summarizes all the data that has been loaded into the DRIMS system from the Excel files.

## ✅ Data Successfully Loaded

### 1. Faculty Members (109+)
- All 74 faculty from Research Targets table
- Additional 35+ faculty from publications data
- All faculty have:
  - Email addresses (auto-generated)
  - Default password: `faculty123`
  - Employee IDs (EMP001 - EMP109+)
  - Designations (auto-determined from name)
  - Research areas

### 2. Research Targets (2025)
- Targets loaded for all 74 faculty from the Research Targets table
- Includes:
  - Journal targets (SCI/ES/Scopus)
  - Conference targets
  - Patent targets
  - Book chapter targets
  - Student targets

### 3. Journal Publications
Key journals loaded from Excel data:
- **Satish Kumar Satti**: "A digital twin-enabled" in Ecological Informatics (Q1, IF: 7.3)
- **Sini Raj Pulari**: 2 journals including IEEE Access (Q1, IF: 4.2)
- **Saubhagya Ranjan**: "Optimized placement" in Scientific Reports
- **Dr. Md Oqail Ahmad**: "Artificial intelligence and machine learning in infectious disease diagnostics" in Microchemical Journal (Q1, IF: 5.1)
- **Renugadevi R**: "Teaching and learning optimization" in J Ambient Intell Human C (Q1, IF: 4.1)

### 4. Conference Publications
Comprehensive conference data loaded including:
- **Maridu Bhargavi**: 10+ conference papers
- **Venkatrama Phani Kumar Sistla**: 15+ conference papers
- **Ravuri Lalitha**: 25+ conference papers
- **Renugadevi R**: Conference on skin cancer detection
- Many more from various international conferences

### 5. Patents
Patents loaded include:
- **Dr Satish Kumar Satti**: "Smart IoT-Enabled Cradle" (202441100095 A)
- **Dr. E. Deepak Chowdary**: "System for Stock Market Analysis" (202541043254 A)
- **Mr.Kiran Kumar Kaveti**: "MACHINE LEARNING-DRIVEN AI" (202541009036 A)
- **Dr Sunil Babu Melingi**: 2 patents including "AI Based Viscosity Measuring Device" (Granted)
- **O. Bhaskaru**: "PHYTOCHEMICAL DETECTION" (438233-001, Granted)
- **Kumar Devapogu**: 2 patents
- **Dr. J. Vinoj**: Patent with Kumar Devapogu

### 6. Book Chapters
Book chapters loaded include:
- **Renugadevi R**: "Unlocking Adopting Artificial Intelligence" (CRC Press)
- **Sourav Mondal**: 2 book chapters (CRC Press, Taylor & Francis)
- **Dr. J. Vinoj**: "Introduction to Quantum Computing" (Wiley)
- **Sanket N Dessai**: "Embedded Network Security and Data Privacy" (CRC Press)
- **SK Sajida Sultana**: "Adopting AI-Driven Evaluation Techniques" (CRC Press)
- **Pushya Chaparala**: "Symbolic Data Studies" (Springer)
- **Dr Chinna Gopi Simhadri**: 2 book chapters (IGI Global)
- **S Sivabalan**: "Revolutionizing Blockchain-Enabled Internet of" (Bentham)
- **Md Oqail Ahmad & Shams Tahrez**: "Accident Detection from AI-Driven Transportation Systems" (Springer)

## 📊 Statistics

- **Total Faculty**: 109+
- **Total Research Targets (2025)**: 74 faculty with targets
- **Total Journal Publications**: 10+ loaded (can be expanded)
- **Total Conference Publications**: 50+ loaded
- **Total Patents**: 10+ loaded
- **Total Book Chapters**: 10+ loaded

## 🔄 Data Loading Process

1. **On Application Startup**: The `FacultyDataLoader` runs automatically
2. **Checks**: Verifies if data already exists (prevents duplicate loading)
3. **Creates**:
   - User accounts (with hashed passwords)
   - Faculty profiles
   - Research targets for 2025
   - All publications (journals, conferences, patents, book chapters)

## 📝 Notes

- All passwords are hashed using BCrypt
- Email addresses are auto-generated from faculty names
- Employee IDs are sequential (EMP001, EMP002, etc.)
- Publications are linked to faculty via `facultyId`
- Research targets are set for year 2025

## 🚀 Next Steps

To load more data:
1. Add entries to the respective methods in `FacultyDataLoader.java`:
   - `addAllJournalPublications()` - for more journals
   - `addAllConferencePublications()` - for more conferences
   - `addAllPatentData()` - for more patents
   - `addAllBookChapterData()` - for more book chapters

2. Or manually add publications through the web interface after login

## 🔐 Default Credentials

- **Admin**: `admin@drims.edu` / `admin123`
- **All Faculty**: `firstname.lastname@drims.edu` / `faculty123`

See `FACULTY_CREDENTIALS_COMPLETE.md` for full list.

