# UMSI 211 - Coding Without Coding

This repository contains course materials for UMSI 211, including lecture notes and lab materials. Graded assignments will be distributed separately.

## For Students

If you got this by accepting the ungraded assignment via github classroom, this is your personal copy of the course materials. You can modify the lab files and add your own notes. If you push them to github they will be visible to you and to the instructor, but not to other students.

### Getting Updates

To get the latest course materials (do this regularly, at least once a week), use the appropriate sync script for your operating system:

#### On macOS/Linux:
```bash
./sync-updates.sh
```

#### On Windows:
```powershell
.\sync-updates.ps1
```

**Note**: If you're on Windows and get a PowerShell execution policy error, you may need to run:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Both scripts will:
1. Add the original repository as an upstream remote
2. Fetch the latest changes
3. Merge updates into your local copy

### First Time Setup

If you haven't run the sync script before, it will automatically set up the upstream remote for you.

## File Structure

The course is organized by week, with each week containing a directory for each session, and each session containing lecture notes and labs as needed:

- `week1/` - Introduction and getting started
  - `notes/` - Lecture notes and course content
  - `labs/` - Lab materials and exercises
  - `resources/` - Additional resources and references
- `week2/` through `week15/` - Weekly course materials (structure ready, content to be added)
- `sync-updates.sh` - Script to sync with instructor updates (macOS/Linux)
- `sync-updates.ps1` - Script to sync with instructor updates (Windows)


## Contributing

Feel free to modify lab files and add your own notes. Your changes will be preserved in your own private copy when you sync updates to github.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
