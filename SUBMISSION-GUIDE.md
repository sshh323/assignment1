# Submission Guide — Assignment 1, Part B

This guide walks through publishing the code to GitHub and running it with Docker.

## 1. Create a public GitHub repository

1. Log in to github.com.
2. Click **New repository**, give it a short name (e.g. `assignment1`).
3. Choose **Public**, do **not** add a README/.gitignore yet (we already have files).
4. Copy the HTTPS URL, e.g. `https://github.com/YOUR-USERNAME/assignment1.git`.

## 2. Initialize git and push

Open a terminal in the project folder (`d:\js作业\shopping-cart`) and run:

```powershell
git init
git add .
git commit -m "Initial commit: command line shopping cart"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/assignment1.git
git push -u origin main
```

(Replace the URL with your own.)

## 3. Update the Dockerfile

Edit `Dockerfile` and replace the placeholder with your repo URL:

```dockerfile
RUN git clone https://github.com/YOUR-USERNAME/assignment1.git .
```

Then commit and push:

```powershell
git add Dockerfile
git commit -m "added my own repo url to dockerfile"
git push
```

## 4. Verify locally

```powershell
npm install
npm run start        # the app should ask you for commands
npm run tests        # the tests should run and pass
```

## 5. Verify with Docker

```powershell
docker build --no-cache -t assignment1 . && docker run --rm -it assignment1
```

The container should start the shopping cart (cloning your repo, then running
`node src/index.js`).

## 6. Submit

1. Upload the video walkthrough to Canvas Studio.
2. Paste the URL of your public GitHub repository in the Canvas submission.

---

## How the teacher checks (for reference)

```bash
mkdir ~/bth012/tmp && cd ~/bth012/tmp
git clone <your-public-repo-url> student-project
cd student-project
docker build --no-cache -t assignment1 . && docker run --rm -it assignment1
```

Because the Dockerfile clones your repo and only runs `node src/index.js`, the
app **must not depend on any npm packages at runtime** — only Node's standard
library is available in the container. This project only uses `node:readline`.
