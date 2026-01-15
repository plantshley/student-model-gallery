# Student Gallery Webpage Implementation Plan

## Overview
Create an interactive, space-themed student gallery webpage that dynamically displays student mental model submissions. The design will match the GitHub-Setup-Starmap aesthetic with cosmic visuals, animated particles, and engaging interactions.

## File Structure

```
student-model-gallery/
├── index.html              # Main gallery webpage
├── styles.css              # Cosmic theme styling
├── script.js               # Dynamic loading & interactions
├── submissions/            # Student contribution folder
│   ├── images/             # Student project images
│   │   └── .gitkeep        # Placeholder to preserve folder
│   └── example.json        # Example submission template
└── README.md               # (existing) Instructions
```

## Key Design Elements

### Visual Theme (matching reference repos)
- **Background**: Deep space (`#0a0a1a`) with tsParticles starfield
- **Accent Colors**: Pink (`#ff6b9d`), Purple (`#a855f7`), Cyan (`#06b6d4`)
- **Fonts**: 'Press Start 2P' for titles, 'JetBrains Mono' for body
- **Effects**: Shooting stars, gradient text animation, glow effects
- **Theme Toggle**: Moonlight (dark) / Sunshine (light) modes

### Gallery Card Design
Each student submission displayed as an interactive card featuring:
- Project thumbnail image with hover glow effect
- Student name and project title
- Description text
- Clickable link to full project
- Entrance animations (staggered fade-in)
- Hover effects (scale, glow, lift)

### Interactive Features
1. **Animated particle background** (tsParticles)
2. **Theme toggle** (dark/light modes with localStorage persistence)
3. **Card hover effects** (scale, glow, sparkle burst)
4. **Smooth scroll** behavior
5. **Responsive grid layout** (adapts to screen size)
6. **Empty state** message when no submissions exist

## Implementation Details

### 1. index.html
- Hero section with animated gradient title
- Theme toggle button (top-right)
- Gallery grid container
- Footer with repository link
- Script imports (tsParticles CDN, local script.js)

### 2. styles.css (~400 lines)
- CSS custom properties for theming (dark/light)
- Particle background styling
- Card component styles with animations
- Responsive breakpoints (desktop, tablet, mobile)
- Keyframe animations (gradient shift, shooting stars, hover effects)
- Accessibility considerations

### 3. script.js (~150 lines)
- **loadSubmissions()**: Fetch all JSON files from submissions folder
- **renderGallery()**: Create card elements for each submission
- **initParticles()**: Configure tsParticles starfield
- **Theme toggle**: Switch themes, save to localStorage
- **Card animations**: Staggered entrance, hover sparkles

### 4. submissions/ folder structure
- `images/` subfolder for student screenshots
- `.gitkeep` files to preserve empty folders in git
- `example.json` as a template (commented or clearly marked as example)

### Example JSON structure (matching README):
```json
{
  "name": "Your Real Name",
  "projectTitle": "Title of Your Mental Model",
  "description": "A one-sentence description of your project.",
  "projectUrl": "https://your-username.github.io/your-project-repo",
  "imagePath": "images/your-username.png"
}
```

## Dynamic Loading Approach

**Using manifest file approach:**
- A single `submissions/submissions.json` file lists all submission filenames
- Students add their JSON file AND add their username to the manifest array
- Reliable, works offline, no API rate limits
- Simple array format: `["student1", "student2"]`

## Files Created

| File | Lines | Purpose |
|------|-------|---------|
| `index.html` | ~85 | Main page structure |
| `styles.css` | ~500 | All styling and animations |
| `script.js` | ~220 | Dynamic loading and interactions |
| `submissions/images/.gitkeep` | 0 | Preserve folder |
| `submissions/submissions.json` | 1 | Manifest of submission files |
| `submissions/_example.json` | 7 | Example template (prefixed with _ to exclude) |

## Verification Plan

1. Open `index.html` in browser - should show empty gallery with particle background
2. Add a test submission JSON and image - should appear in gallery
3. Test theme toggle - should switch between dark/light modes
4. Test responsive design - resize browser to verify mobile layout
5. Test card interactions - hover effects and link clicks
6. Verify GitHub Pages deployment works correctly
