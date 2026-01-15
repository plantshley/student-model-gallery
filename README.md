# Student Gallery Repository

Welcome to the Student Mental Model Gallery! This repository hosts the final projects for the semester.

After going on the [**Universe of Tools Persona Quest**](https://plantshley.github.io/web-tools-persona-quest/), you will have complete freedom to choose your tool and method. All final projects will be collected and displayed on this gallery webpage. Your goal is to contribute your project to this gallery by submitting a **Pull Request (PR)**.

## How to Contribute

To avoid merge conflicts (where multiple people try to edit the same line of code at the same time), this repository uses a **structured data** approach. You will not edit the website code directly. Instead, you will add a single data file containing your project information.

### Prerequisites

- You have gone on the [**Universe of Tools Persona Quest**](https://plantshley.github.io/web-tools-persona-quest/) and chosen a tool for creating your final mental model
- You have completed your final mental model using your tool of choice.
- You have downloaded a file of your mental model **and/or** have a public URL for your project (a shareable link or webpage hosted via GitHub pages).

### Step-by-Step Instructions

1. **Fork this Repository**
   - Click the **Fork** button in the top-right corner of this page.
   - This creates a copy of this repository under your own GitHub account.

2. **Clone Your Fork**
   - Clone your forked repository to your local machine.

3. **Upload Your Image**
   - Open the repository folder.
   - Navigate to `submissions/images/`.
   - Paste your image file here.
   - **Rename the file** to match your GitHub username exactly (e.g., `jdoe.png`). This prevents overwriting other students' files.

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

```json
{
  "name": "Your Real Name",
  "projectTitle": "Title of Your Mental Model",
  "description": "A one-sentence description of your project.",
  "projectUrl": "https://your-username.github.io/your-project-repo",
  "imagePath": "images/your-username.png"
}
```

6. **Register Your Submission**
   - Open the file `submissions/submissions.json`.
   - Add your GitHub username to the array.
   - For example, if the file contains `["alice", "bob"]` and your username is `charlie`, change it to `["alice", "bob", "charlie"]`.
   - **Important:** Make sure to add a comma before your username if there are existing entries!

7. **Check Your JSON Syntax**
   - Ensure there are quotes `""` around every key and value.
   - Ensure there are no trailing commas after the last item.

8. **Commit and Push**
   - Save your files.
   - Commit the change with a message like: "Add submission for [Name]".
   - Push the changes to your forked repository.

9. **Submit a Pull Request**
   - Go back to the **original** [Student Gallery repository](https://github.com/plantshley/student-model-gallery.git) page on GitHub.
   - Click the **Pull Requests** tab.
   - Click **New Pull Request**.
   - Select **Compare across forks**.
   - Set the "Head Repository" to your fork.
   - Click **Create Pull Request**.

### Troubleshooting

- **"Merge Conflict" Error:** This shouldn't happen if you created a unique file in the `submissions` folder. If it does, ensure you didn't accidentally modify other files.
- **JSON Errors:** If your project doesn't appear on the site after merging, check that your JSON file is valid text.
