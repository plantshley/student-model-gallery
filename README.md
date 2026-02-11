# Student Gallery Repository

Welcome to the Student Mental Model Gallery! This repository hosts the final projects for the semester.

After going on the [**Universe of Tools Persona Quest**](https://plantshley.github.io/web-tools-persona-quest/), you will have complete freedom to choose your creation tools and method. All final projects will be collected and displayed on this gallery webpage. Your goal is to contribute your project to this gallery by submitting a **Pull Request (PR)**.

## How to Contribute

To avoid merge conflicts (where multiple people try to edit the same line of code at the same time), this repository uses a **structured data** approach. You will not edit the website code directly. Instead, you will add a single data file containing your project information.

### Prerequisites

- You have gone on the [**Universe of Tools Persona Quest**](https://plantshley.github.io/web-tools-persona-quest/)
- You have completed your final video walk-through using your tool(s) of choice.
- You have an image or video file of your mental model (screenshots or screenrecordings work fine!) Supported formats: PNG, JPG, GIF, MP4, WebM, MOV, AVI
- *[Optional]* You have a public URL for your project if it's hosted online (e.g., shareable link or webpage such as one hosted via GitHub pages), or an external link related to your project content.

### Step-by-Step Instructions

1. **Fork this Repository**
   - Click the **Fork** button in the top-right corner of this page.
   - This creates a copy of this repository under your own GitHub account.

2. **Clone Your Fork**
   - Clone your forked repository to your local machine.

3. **Upload Your Image/Video**
   - Open the repository folder.
   - Navigate to `submissions/projects/`.
   - Paste your image or video file here.
   - **Rename the file** to match your GitHub username exactly (e.g., `twinkle-fairy.png` or `twinkle-fairy.mp4`). This prevents overwriting other students' files.

4. **Create Your Data File**
   - Open your project in **VS Code**.
   - In the left sidebar (Explorer), find and **right-click** the `submissions/` folder.
   - Select **New File**.
   - Type the name exactly: `your-github-username.json` (e.g., if your username is `twinkle-fairy`, name it `twinkle-fairy.json`).
   - Press **Enter**.
   - **Important:** Ensure you are creating a *new* file and not editing anyone else's file!

5. **Add Your Data**
   - Copy and paste the code block below into your new JSON file.
   - Replace the values with your actual information. 
   - For the `description` field, you can add multiple paragraphs to fully explain your work, or just a concise sentence or two.
   - **Note:** The `projectUrl` field is optional. If you don't have an external link for your project, you can remove that entire line.

```json
{
  "name": "Your Real Name",
  "projectTitle": "Title of Your Mental Model",
  "description": "A description of your project.",
  "projectUrl": "https://your-username.github.io/your-project-repo",
  "projectPath": "projects/your-username.mp4"
}
```

**Note:** The `projectPath` can point to an image (PNG, JPG, GIF) or video file (MP4, WebM, MOV, AVI). For example: `"projectPath": "projects/your-username.mp4"`

6. **Register Your Submission**
   - Open the file `submissions/submissions.json`.
   - Add your GitHub username to the array.
   - For example, if the file contains `["glitterheart", "magic-pegasus"]` and your username is `twinkle-fairy`, change it to `["glitterheart", "magic-pegasus", "twinkle-fairy"]`.
   - **Important:** Make sure to add a comma before your username if there are existing entries!

7. **Check Your JSON Syntax**
   - Ensure there are quotes `""` around every key and value.
   - Ensure there are no trailing commas after the last item.

8. **Preview Your Submission Locally**
   - Before committing, check that your submission appears correctly on the site.
   - **Option 1 - Open in Browser**:
     - Navigate to your project folder in File Explorer.
     - Right-click on `index.html` and select "Open with" → your preferred web browser.
   - **Option 2 - VS Code Live Preview**:
     - In VS Code, right-click on `index.html` in the Explorer sidebar.
     - Select "Open with Live Server" (if you have the Live Server extension installed).
     - Or use the built-in "Open Preview" option.
   - Your submission should appear in the gallery. Click on it to verify all your information displays correctly in the modal.

9. **Commit and Push**
   - Save your files.
   - Commit the change with a message like: "Add submission for [Name]".
   - Push the changes to your forked repository.

10. **Submit a Pull Request**
    - Go back to the **original** [Student Gallery repository](https://github.com/plantshley/student-model-gallery.git) page on GitHub.
    - Click the **Pull Requests** tab.
    - Click **New Pull Request**.
    - Select **Compare across forks**.
    - Set the "Head Repository" to your fork.
    - Click **Create Pull Request**.

### Troubleshooting

- **"Merge Conflict" Error:** This shouldn't happen if you created a unique file in the `submissions` folder. If it does, ensure you didn't accidentally modify other files.
- **JSON Errors:** If your project doesn't appear on the site after merging, check that your JSON file is valid text.
- Refer back to the [Setting Up GitHub Starmap](https://plantshley.github.io/making-thinking-visual/index.html) for further help.
