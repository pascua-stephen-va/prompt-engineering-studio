# Prompt Engineering Studio

An interactive **Prompt Engineering Studio** web application covering **1 Core Lesson & 7 Live Tasks**—from positive and negative prompting (with live automatic opposite mirroring) to 50-second vertical 9:16 video scripting, standalone motion JSON conversion, single-thread image/video generation workflows, and ElevenLabs voiceover + final cut assembly.

## Local Development

```bash
npm install --legacy-peer-deps
npm run dev
```

The development server runs at `http://localhost:3000`.

## Production Build

```bash
npm run build
```

Builds the static site into `./dist`.

## GitHub Pages Deployment

This repository includes `.github/workflows/deploy.yml`, which automatically runs `npm install --legacy-peer-deps`, builds the project into `./dist`, and deploys it to GitHub Pages on every push to `main` (or via manual **Run workflow**).

To enable deployment on GitHub:
1. Push this repository to GitHub (default branch `main`).
2. Go to **Settings → Pages**.
3. Under **Build and deployment → Source**, select **GitHub Actions**.
