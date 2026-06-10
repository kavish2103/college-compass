# CollegeCompass — Full-Stack College Discovery & Comparison Platform

CollegeCompass is a production-grade Web application engineered to search, filter, compare, and bookmark premier Indian universities (IITs, NITs, and other major private/deemed universities). Evaluated on strict architectural patterns, database relational integrity, and high-performance design.

---

## 🏛️ System Architecture

The following diagram illustrates the data flow and boundary separations:

```text
               +-------------------------------------------------------+
               |                     CLIENT WEB PORTAL                 |
               |  (Next.js App Router - React Client Components)       |
               +---------------------------+---------------------------+
                                           |
                              HTTP APIs    |   NextAuth Sessions
                            & JSON Data    |   (Credentials/Google OAuth)
                                           v
               +-------------------------------------------------------+
               |                    SERVERLESS BACKEND                 |
               |     (Next.js Server API Routes & Server Components)   |
               |                                                       |
               |  +-------------------+        +--------------------+  |
               |  |  Zod Validations  |        |  Route Middleware  |  |
               |  +---------+---------+        +---------+----------+  |
               |            |                            |             |
               |            | Schema                     | Protects    |
               |            v                            v             |
               |  +-------------------------------------------------+  |
               |  |                Prisma Client ORM                |  |
               |  +------------------------+------------------------+  |
               +---------------------------|---------------------------+
                                           |
                             SQL Queries   |
                            & Connections  v
               +-------------------------------------------------------+
               |                   POSTGRESQL DATABASE                 |
               |                       (Neon Cloud)                    |
               +-------------------------------------------------------+
```

---

## 🛠️ Tech Stack & Rationales

1. **Frontend: Next.js 14 (App Router)**
   * *Rationale*: Next.js App Router provides optimal caching, server components to reduce Client bundle weight, and hybrid pre-rendering models (Static and Dynamic rendering).
2. **Backend: Next.js API Routes**
   * *Rationale*: Integrates unified TypeScript compilation alongside our pages. Simplifies deployment boundaries by running serverless route endpoints.
3. **Database: PostgreSQL with Prisma ORM**
   * *Rationale*: Relation-heavy structures (Colleges, Courses, Placements, Reviews, SavedBookmarks) require robust SQL foreign key integrity. Prisma ORM handles strict schema definitions, migrations tracking, type-safe queries, and seed configurations.
4. **Auth: NextAuth.js**
   * *Rationale*: Secure, industry-standard authentication mapping Credentials and Google OAuth Providers, using JWT storage strategies to prevent state overload.
5. **Styling: TailwindCSS**
   * *Rationale*: Utility-first styling for speed, custom visual consistency, and responsiveness.

---

## ✨ Features Checklist

* **Hero Searching**: Instant search matching names, description, city, state, and location.
* **Catalog Directory & Multi-Filtering**: Refine colleges by:
  * Institution Type (Government, Private, Deemed).
  * State and City.
  * Offered Course Degrees.
  * Annual Fee Ranges (using slider parameters).
  * Minimum Ratings.
* **Shareable URL Filters**: All search/filters persist in URL search parameters. Sharing a link reloads the exact catalog view.
* **Tabbed Profile Detail View**:
  * *Overview Tab*: Institutional description, general metadata, established year, and links.
  * *Courses Tab*: Searchable list of degrees, durations, seats, and fees.
  * *Placements Tab*: 3-year history of average, median, and highest packages, placement rate, and top recruiting companies.
  * *Reviews Tab*: Verified ratings, batches, and course breakdowns with pros/cons.
* **Verified Student Review Form**: Submit ratings (1-5 stars) and reviews. Logs automatically detect user session to flag verified feedback and recalculate college overall ratings reactively.
* **Bookmarks shortlists**: Save colleges and manage bookmarks from a protected `/saved` page (guaranteed via Next.js Middleware).
* **3-way Side-by-Side Comparison**:
  * Compare up to 3 colleges on key metrics.
  * **Winner Highlighting**: Highlights best metrics (highest package/rate, lowest fees, best rating) in green.
  * Fallback to context selections or shareable URL lists.

---

## 🚀 Local Setup Instructions

### 1. Prerequisites
Ensure you have **Node.js (v18+)** and **npm** installed.

### 2. Install Dependencies
```bash
git clone https://github.com/kavish2103/college-compass.git
cd college-compass
npm install
```

### 3. Setup Environment Variables
Create a `.env` file at the root level matching `.env.example`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/collegecompass"
NEXTAUTH_SECRET="use-a-secure-random-key"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### 4. Database Setup (Migrations & Seeding)
Initialize database schemas and seed 21 realistic Indian colleges with placement histories, courses, and review logs:
```bash
# Push schema migrations
npx prisma db push

# Seed the database
npx prisma db seed
```

### 5. Start Local Dev Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📡 API Reference Schema

All API endpoints return a standardized, consistent payload structure:
```json
{
  "success": true,
  "data": [],
  "error": "Error message if success is false",
  "meta": {
    "page": 1,
    "limit": 5,
    "total": 20,
    "totalPages": 4
  }
}
```

### Endpoints

* **`GET /api/colleges`**
  * *Parameters*: `search`, `page`, `limit`, `state`, `city`, `type`, `degree`, `minFees`, `maxFees`, `minRating`.
  * *Description*: Paginated list of colleges matching search query.
* **`GET /api/colleges/[id]`**
  * *Description*: Details of a single college by ID, including courses and placements.
* **`POST /api/colleges/[id]`**
  * *Payload*: `{ rating, title, content, pros, cons, authorName, batch, course }`
  * *Description*: Create review and recalculate college rating statistics. Requires authentication for verified badge flag.
* **`GET /api/colleges/[id]/reviews`**
  * *Parameters*: `page`, `limit` (default 5).
  * *Description*: Paginated reviews lists for a college.
* **`GET /api/colleges/compare`**
  * *Parameters*: `collegeIds` (comma-separated).
  * *Description*: Detailed statistics of up to 3 colleges side-by-side.
* **`GET /api/user/saved`**
  * *Description*: Retrieves bookmarked list for the authenticated user session.
* **`POST /api/user/saved`**
  * *Payload*: `{ collegeId }`
  * *Description*: Toggle save/unsave college bookmark.
* **`POST /api/api/auth/register`**
  * *Payload*: `{ name, email, password }`
  * *Description*: Credentials user signup.

---

## 📐 Design Decisions

* **Zod Schemas**: Used Zod to enforce strict boundary checking on both incoming API requests and form submissions.
* **URL Search Params for Filters State**: Storing filter criteria in URL query strings makes page reloads, browser history (back/forward actions), and link-sharing completely reliable.
* **NextAuth Session JWTs**: Fast, stateless tokens encrypted using AES keys that fit perfectly in cookie payloads.
* **CompareContext client hook**: A React Context persisting compared listings locally to support catalog selections and pop up floating bottom badges across search page browsing.
* **Prisma Transactions**: Recalculating ratings after posting reviews occurs inside a single database Transaction boundary, ensuring ratings cannot mismatch.

---

## ⚠️ Known Limitations & Future Improvements

1. **OAuth Redirects on Local Host**: Google Sign-In requires HTTPS and domain setups on production console settings. Currently set to allow localhost callbacks.
2. **Review Edit Access**: Currently reviews are append-only. Adding edit/delete endpoints is a logical next step.
3. **Advanced Visual Analytics**: Integrating interactive charts (like Chart.js/Recharts) on the Compare page to plot placement package trends.
