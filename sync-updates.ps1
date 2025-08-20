# UMSI 211 Course Materials Sync Script (PowerShell Version)
# This script helps students sync their local copy with instructor updates
# Compatible with Windows PowerShell 5.1+ and PowerShell Core 6.0+

# Set error action preference to stop on errors
$ErrorActionPreference = "Stop"

# Colors for output (PowerShell compatible)
$Colors = @{
    Red = "Red"
    Green = "Green"
    Yellow = "Yellow"
    Blue = "Blue"
    White = "White"
}

# Function to print colored output
function Write-Status {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor $Colors.Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor $Colors.Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor $Colors.Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor $Colors.Red
}

# Check if we're in a git repository
try {
    $null = git rev-parse --git-dir
} catch {
    Write-Error "This directory is not a git repository. Please run this script from your course materials directory."
    exit 1
}

# Get the current remote origin URL (student's fork)
try {
    $OriginUrl = git remote get-url origin 2>$null
} catch {
    $OriginUrl = ""
}

if (-not $OriginUrl) {
    Write-Error "No origin remote found. Please make sure you have cloned your repository."
    exit 1
}

Write-Status "Current repository: $OriginUrl"

# Check if this is the template repository (instructor's working copy)
if ($OriginUrl -like "*umsi211-f25-course-resources*") {
    Write-Status "This appears to be a course materials repository."
    Write-Status "Setting up sync with instructor updates..."
}

# Check if upstream remote already exists
try {
    $UpstreamUrl = git remote get-url upstream 2>$null
    Write-Status "Upstream remote already configured."
    Write-Status "Upstream URL: $UpstreamUrl"
} catch {
    Write-Status "Setting up upstream remote..."
    
    # For GitHub Classroom assignments, students get their own copies
    # The upstream should point to the original instructor repository
    $UpstreamUrl = "https://github.com/umsi211-f25-course-resources.git"
    
    Write-Status "Adding upstream remote: $UpstreamUrl"
    Write-Status "Note: This assumes the instructor repository is at the above URL."
    Write-Status "If you get an error, please contact your instructor for the correct URL."
    
    git remote add upstream $UpstreamUrl
}

Write-Status "Fetching latest changes from upstream..."

# Try to fetch from upstream
try {
    git fetch upstream
} catch {
    Write-Error "Failed to fetch from upstream repository."
    Write-Error "This could mean:"
    Write-Error "1. The instructor repository URL has changed"
    Write-Error "2. You don't have access to the repository"
    Write-Error "3. There's a network issue"
    Write-Error ""
    Write-Error "Please contact your instructor for the correct repository URL."
    Write-Error "You can also check the current upstream URL with: git remote get-url upstream"
    exit 1
}

# Check if there are any new commits
$LocalCommit = git rev-parse HEAD
try {
    $UpstreamCommit = git rev-parse upstream/main 2>$null
} catch {
    try {
        $UpstreamCommit = git rev-parse upstream/master 2>$null
    } catch {
        Write-Error "Could not determine upstream branch. Please check your upstream remote configuration."
        exit 1
    }
}

if ($LocalCommit -eq $UpstreamCommit) {
    Write-Success "Your local copy is already up to date!"
    exit 0
}

Write-Status "New updates available. Merging changes..."

# Get the current branch name
$CurrentBranch = git branch --show-current

# Check if there are uncommitted changes
try {
    $null = git diff-index --quiet HEAD --
    $Stashed = $false
} catch {
    Write-Warning "You have uncommitted changes. Stashing them before merge..."
    git stash push -m "Stashing changes before sync with upstream"
    $Stashed = $true
}

# Try to merge upstream changes
try {
    git merge upstream/main 2>$null
    $MergeSuccess = $true
} catch {
    try {
        git merge upstream/master 2>$null
        $MergeSuccess = $true
    } catch {
        $MergeSuccess = $false
    }
}

if ($MergeSuccess) {
    Write-Success "Successfully merged upstream changes!"
    
    if ($Stashed) {
        Write-Status "Restoring your stashed changes..."
        try {
            git stash pop
            Write-Success "Your changes have been restored!"
        } catch {
            Write-Warning "There were conflicts when restoring your changes. Please resolve them manually."
            Write-Status "Your stashed changes are still available with 'git stash list'"
        }
    }
    
    Write-Success "Sync completed successfully!"
    Write-Status "You now have the latest course materials while preserving your local changes."
    
} else {
    Write-Error "Merge failed due to conflicts."
    Write-Status "This usually means you've made changes to files that were also updated by the instructor."
    Write-Status "Please resolve the conflicts manually and then commit the resolution."
    
    if ($Stashed) {
        Write-Status "Your original changes are stashed. Resolve conflicts first, then run 'git stash pop'"
    }
    
    exit 1
} 