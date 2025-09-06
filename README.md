# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/c01fb0f7-9763-45fb-bb09-cbc53b32c80b

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/c01fb0f7-9763-45fb-bb09-cbc53b32c80b) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
npm i
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/c01fb0f7-9763-45fb-bb09-cbc53b32c80b) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

# Adven Spark

## Running the Backend Servers

### 1. News Server

The news server fetches relevant news articles for your application.

**Install dependencies:**
```sh
npm install express cors node-fetch
```

**Start the news server:**
```sh
node news-server.js
```
The news server will run on [http://localhost:4001](http://localhost:4001).

---

### 2. Perplexity AI Server

The Perplexity AI server connects your app to the Perplexity API for AI-generated content.

**Install dependencies:**
```sh
npm install express cors axios
```

**Start the Perplexity AI server:**
```sh
node perplexity-ai-server.js
```
The AI server will run on [http://localhost:3002](http://localhost:3002).

---

## Notes

- Make sure both servers are running before using the frontend.
- Update API URLs in your frontend if you change the ports.
- For development, you may want to run both servers
