# August Agency - Client Portal & Website

A premium web application for August Marketing Agency, featuring a stunning landing page and a full-featured Client Portal.

## Tech Stack
- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) + [Framer Motion](https://www.framer.com/motion/)
- **Database:** [PostgreSQL](https://www.postgresql.org/) + [Prisma ORM](https://www.prisma.io/)
- **Authentication:** [NextAuth.js](https://next-auth.js.org/)

## Getting Started

1. **Environment Setup**
   Copy `.env.example` to `.env` and fill in your database credentials:
   ```bash
   cp .env.example .env
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Database Migration**
   Run the initial migration to create the schema in your database:
   ```bash
   npx prisma db push
   # OR
   npx prisma migrate dev --name init
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Next Steps
- Run `/plan` to design the first feature.
- Run `/visualize` if you want to focus on the UI/UX first.
# August-Labs
