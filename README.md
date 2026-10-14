# DevCommunity 🚀

> A full-stack developer community platform for learning, sharing, and discovering technical content. Built with Next.js 16 App Router, MongoDB Atlas, Auth.js, and Tailwind CSS.
> **Live Demo:** (https://dev-community-hanaa.vercel.app)

---

## 📌 Product Vision & Features

DevCommunity provides a dark-themed, content-first experience built specifically for software developers:

- 🌐 **Community & Discovery**: Explore developer communities, view topic tags, search posts and communities, and filter by topics.
- 📝 **Content CRUD**: Authors can publish blog posts, write markdown content, edit/delete their own posts, and post comments.
- 🔖 **Bookmarks & Likes**: Save posts to personal bookmarks and view liked posts and comment engagement.
- 🔐 **Authentication & Security**: OAuth sign-in via GitHub and Google powered by Auth.js. Server-side authorization checks and Zod schema validation protect all mutations.
- ⚡ **Production UI**: Custom responsive dark theme built with Tailwind CSS, complete with `loading.tsx`, `error.tsx`, and `not-found.tsx` boundaries.

---

## 🛠️ Tech Stack

| Domain | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **Database** | MongoDB Atlas & Mongoose |
| **Authentication** | Auth.js (NextAuth v5 - GitHub & Google OAuth) |
| **Validation** | Zod (Client & Server boundary validation) |
| **Styling** | Tailwind CSS |
| **Deployment** | Vercel & MongoDB Atlas Free Cluster |

---

## 📂 Code Organization

```text
├── app/                  # Routes, layouts, pages, loading/error/not-found boundaries, API handlers
│   ├── api/              # Protected RESTful Route Handlers
│   ├── blogs/            # Public blog pages & ISR dynamic routes
│   ├── bookmarks/        # Saved user bookmarks page
│   ├── communities/      # Community explore & detail pages
│   ├── create/           # Post creation pages
│   ├── dashboard/        # Authenticated user dashboard
│   ├── profile/          # Public user profile pages
│   ├── search/           # Global post and community search page
│   ├── settings/         # Profile management
│   ├── signIn/           # Authentication sign-in page
│   ├── signUp/           # New user registration page
│   ├── error.tsx         # Global error boundary
│   ├── loading.tsx       # Loading skeleton UI
│   └── not-found.tsx     # Custom 404 UI
├── components/           # Reusable client & server UI components
├── constants/            # navigation items
├── lib/                  # DB connection helper, auth options, reusable logic
├── models/               # Mongoose database models (User, Post, Comment, Community, Bookmark)
├── schemas/              # Zod validation schemas
└── types/                # Shared TypeScript interfaces
```

---

## 🗄️ Database Design

Data access patterns govern schema structure and decisions regarding embedding vs. referencing:

- **User**: Stores OAuth profiles, bio, social links, and custom preferences.
- **Community**: References the creator ID and stores member references.
- **Post**: References `author` and `community`. Has indexed fields for search and filtering.
- **Comment**: Embedded subdocuments within the `Post` model for fast document retrieval alongside post content.
- **Bookmark**: Standalone collection referencing `user` and `post` IDs.

---

## ⚡ Rendering Strategies

DevCommunity intentionally leverages multiple Next.js rendering techniques:

1. **Incremental Static Regeneration (ISR)**: `/blogs/[slug]` and `/communities/[slug]` are revalidated periodically for fast public page loads.
2. **Server-Side Dynamic Rendering**: `/dashboard` and `/settings` require runtime authentication context and fetch live personalized data per request.
3. **Static Rendering**: Landing page and public entry points are statically generated for maximum performance.

---

## 🌐 Production Deployment

- **Database**: Hosted on **MongoDB Atlas** with IP Network Access set to allow connection from Vercel deployment environments (`0.0.0.0/0`).
- **Hosting**: Deployed on **Vercel** connected directly to the GitHub `main` branch.
- **OAuth Callback URLs**: GitHub and Google Cloud Developer consoles configured with the production domain callback routes: - \`https://dev-community-hanaa.vercel.app/api/auth/callback/github\` - \`https://dev-community-hanaa.vercel.app/api/auth/callback/google\`
