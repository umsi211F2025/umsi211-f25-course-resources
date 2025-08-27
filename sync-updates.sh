#!/bin/bash

# UMSI 211 Course Materials Sync Script
# This script helps students sync their local copy with instructor updates

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    print_error "This directory is not a git repository. Please run this script from your course materials directory."
    exit 1
fi

# Get the current remote origin URL (student's fork)
ORIGIN_URL=$(git remote get-url origin 2>/dev/null || echo "")

if [ -z "$ORIGIN_URL" ]; then
    print_error "No origin remote found. Please make sure you have cloned your repository."
    exit 1
fi

print_status "Current repository: $ORIGIN_URL"

# Check if this is the template repository (instructor's working copy)
# For now, we'll assume this is the template if we can't fetch from the expected upstream
# Students will have different repository names from GitHub Classroom
if [[ "$ORIGIN_URL" == *"umsi211-f25-course-resources"* ]]; then
    print_status "This appears to be a course materials repository."
    print_status "Setting up sync with instructor updates..."
fi

# Check if upstream remote already exists
if git remote get-url upstream > /dev/null 2>&1; then
    print_status "Upstream remote already configured."
    UPSTREAM_URL=$(git remote get-url upstream)
    print_status "Upstream URL: $UPSTREAM_URL"
else
    print_status "Setting up upstream remote..."
    
    # For GitHub Classroom assignments, students get their own copies
    # The upstream should point to the original instructor repository
    UPSTREAM_URL="https://github.com/umsi211F2025/umsi211-f25-course-resources"
    
    print_status "Adding upstream remote: $UPSTREAM_URL"
    print_status "Note: This assumes the instructor repository is at the above URL."
    print_status "If you get an error, please contact your instructor for the correct URL."
    
    git remote add upstream "$UPSTREAM_URL"
fi

print_status "Fetching latest changes from upstream..."

# Try to fetch from upstream
if ! git fetch upstream; then
    print_error "Failed to fetch from upstream repository."
    print_error "This could mean:"
    print_error "1. The instructor repository URL has changed"
    print_error "2. You don't have access to the repository"
    print_error "3. There's a network issue"
    print_error ""
    print_error "Please contact your instructor for the correct repository URL."
    print_error "You can also check the current upstream URL with: git remote get-url upstream"
    exit 1
fi

# Check if there are any new commits
LOCAL_COMMIT=$(git rev-parse HEAD)
UPSTREAM_COMMIT=$(git rev-parse upstream/main 2>/dev/null || git rev-parse upstream/master 2>/dev/null)

if [ "$LOCAL_COMMIT" = "$UPSTREAM_COMMIT" ]; then
    print_success "Your local copy is already up to date!"
    exit 0
fi

print_status "New updates available. Merging changes..."

# Get the current branch name
CURRENT_BRANCH=$(git branch --show-current)

# Check if there are uncommitted changes
if ! git diff-index --quiet HEAD --; then
    print_warning "You have uncommitted changes. Stashing them before merge..."
    git stash push -m "Stashing changes before sync with upstream"
    STASHED=true
else
    STASHED=false
fi

 # Try to merge upstream changes
if git merge upstream/main --no-edit 2>/dev/null || git merge upstream/master --no-edit 2>/dev/null; then
    print_success "Successfully merged upstream changes!"
    
    if [ "$STASHED" = true ]; then
        print_status "Restoring your stashed changes..."
        if git stash pop; then
            print_success "Your changes have been restored!"
        else
            print_warning "There were conflicts when restoring your changes. Please resolve them manually."
            print_status "Your stashed changes are still available with 'git stash list'"
        fi
    fi
    
    print_success "Sync completed successfully!"
    print_status "You now have the latest course materials while preserving your local changes."
    
else
    print_error "Merge failed due to conflicts."
    print_status "This usually means you've made changes to files that were also updated by the instructor."
    print_status "Please resolve the conflicts manually and then commit the resolution."
    
    if [ "$STASHED" = true ]; then
        print_status "Your original changes are stashed. Resolve conflicts first, then run 'git stash pop'"
    fi
    
    exit 1
fi 