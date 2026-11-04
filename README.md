# Blog CMS

A full-stack Blog Content Management System built with Next.js, TypeScript, Tailwind CSS, Prisma ORM, MongoDB Atlas, and Tiptap.

## Live Demo

- **Live Website:** https://hb-softweb-blog-cms.vercel.app
- **GitHub Repository:** https://github.com/Vinay-Kotiya/hb-softweb-blog-cms

## Features

### Admin Dashboard

- Create, edit, delete, and manage blog posts.
- Rich-text blog editor powered by Tiptap.
- Support for bold, italic, underline, headings, lists, highlights, text colors, and hyperlinks.
- Preview blog content before publishing.
- Persistent blog content stored in MongoDB.

### Public Blog

- Dynamic blog listing page.
- Individual blog detail pages with dynamic slugs.
- Rich-text content rendering.
- Responsive editorial-style interface.
- Custom 404 page for invalid blog URLs.
- SEO metadata for blog pages.

## Technology Stack

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Tiptap Rich Text Editor
- Prisma ORM
- MongoDB Atlas
- GitHub Actions
- Vercel

## Prerequisites

- Node.js 22.x
- npm
- MongoDB Atlas account
- Git

## Installation

Clone the repository:

```bash
git clone https://github.com/Vinay-Kotiya/hb-softweb-blog-cms.git
cd hb-softweb-blog-cms
```

Install dependencies:

```bash
npm install
```

## Environment Variables

Create a `.env.local` file in the project root:

```env
DATABASE_URL="YOUR_MONGODB_ATLAS_CONNECTION_STRING"
```

Add any additional environment variables required by your implementation.

Never commit real environment credentials.

## Database Setup

Generate the Prisma Client:

```bash
npx prisma generate
```

Ensure your MongoDB Atlas cluster is running and the connection string is configured correctly.

## Run Locally

Start the development server:

```bash
npm run dev
```

Open:

http://localhost:3000

## Quality Checks

Run ESLint:

```bash
npm run lint
```

Run TypeScript validation:

```bash
npx tsc --noEmit
```

Create a production build:

```bash
npm run build
```

## Project Structure

```text
src/
├── app/
│   ├── admin/
│   ├── api/
│   ├── blog/
│   └── page.tsx
├── components/
└── lib/

prisma/
└── schema.prisma
```

## Database Model

The application uses a Blog model containing:

- `id`: Unique MongoDB ObjectId
- `title`: Blog title
- `slug`: Unique URL-friendly identifier
- `content`: Tiptap JSON rich-text content
- `createdAt`: Creation timestamp
- `updatedAt`: Last modification timestamp

## CI/CD

GitHub Actions validates the project using ESLint, TypeScript, and the configured test command.

After successful validation, the workflow builds and deploys the application to Vercel.

## Deployment

The production application is deployed on Vercel with MongoDB Atlas configured through production environment variables.

## Author

Developed as a Full Stack Developer practical assignment for HP Softweb Private Limited.
