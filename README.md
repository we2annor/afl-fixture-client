# AFL Fixture

A small Next.js app that displays the AFL season fixture and lets you filter
matches by round, venue, or team.

## What it does

On load, the app fetches the full season fixture from a remote API, flattens
it into a single list of matches, and renders each match as a card showing
the two teams, kickoff time, venue, score (once played), and status. Three
labelled filters above the list — **Filter by Rounds**, **Filter by Venue**,
and **Filter by Teams** — let you narrow the list down; they can be combined
(e.g. a specific team at a specific venue).

The page has a site header (title) and footer (copyright), the layout is
mobile-first (filters stack and cards go single-column on small screens,
widening up through tablet/desktop breakpoints), and loading/error/empty
states are exposed to screen readers via ARIA live regions.

### Data source

Match data comes from a single public endpoint, called client-side on page
load:

```
https://0p0s8y841d.execute-api.ap-southeast-2.amazonaws.com/test/react-code-test/fixture
```

It returns the whole season as a list of phases, each containing rounds,
each containing matches (see `lib/types.ts` for the exact shape). Team logos
are fetched from a companion S3 bucket at
`https://react-code-test.s3.ap-southeast-2.amazonaws.com/logos/<TEAM_CODE>.svg`;
if a logo fails to load, the match card falls back to showing the team's
short code instead.

No API key or environment configuration is needed — both endpoints are
public and unauthenticated.

## Tech stack

- **[Next.js](https://nextjs.org)** (App Router) + React 19 + TypeScript
- **[TanStack Query](https://tanstack.com/query)** for fetching and caching
  the fixture (`hooks/useFixture.ts`)
- **[shadcn/ui](https://ui.shadcn.com)** components built on
  **[`@base-ui/react`](https://base-ui.com)**, styled with Tailwind CSS v4
- **[Vitest](https://vitest.dev)** + **React Testing Library** for unit and
  integration tests

## Project structure

```
app/                  Next.js App Router pages, layout, and providers
components/layout/    Site chrome: Header (title) and Footer (copyright)
components/fixture/   The fixture UI: MatchCard, MatchList, and the three filters
components/ui/        shadcn/ui primitives (Select, Card, Badge, Label, Button, ...)
hooks/useFixture.ts   TanStack Query hook that fetches + flattens the fixture
lib/fixture.ts        Fetching, flattening, and filter-option logic
lib/types.ts          TypeScript types matching the fixture API's response shape
lib/utils.ts          shadcn's `cn()` className helper
```

## Getting started

Requires Node.js 20+.

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app. The
page auto-updates as you edit the code.

## Testing

Tests use Vitest with jsdom and React Testing Library, covering the data
layer (`lib/fixture.ts`), the query hook, each component, and an end-to-end
integration test of the page (mocked fetch, driving the filters, asserting
on the rendered results).

Run the test suite once:

```bash
npm test
```

Or in watch mode while developing:

```bash
npm run test:watch
```

## Other scripts

```bash
npm run build   # production build
npm start       # run the production build (after `npm run build`)
npm run lint    # ESLint
```

## Author

Ernest Annor
