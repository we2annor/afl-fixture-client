# AFL Fixture

A small Next.js app that displays the AFL season fixture and lets you filter
matches by round, venue, or team.

## What it does

On load, the app fetches the full season fixture from a remote API, flattens
it into a single list of matches, and renders each match as a card showing
the two teams, kickoff time, venue, score (once played), and status. Three
filters above the list — **Filter by Rounds**, **Filter by Venue**, and
**Filter by Teams** — let you narrow the list down, and they combine (e.g. a
specific team at a specific venue). The (filtered) list is paginated at 15
cards per page, with Previous/Next controls below it. The layout is
mobile-first: a single column of cards and stacked filters on small screens,
widening to two columns at tablet width and three columns with filters in a
row on desktop.

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

- **[Next.js](https://nextjs.org)** (App Router) + React 19 + TypeScript —
  not a technical necessity for an app this size, but a deliberate choice:
  it's a common production stack (including, as far as I'm aware, at
  companies like Champion Data), so building on it here doubles as a
  signal of being comfortable in that environment.
- **[TanStack Query](https://tanstack.com/query)** for fetching and caching
  the fixture (`hooks/useFixture.ts`)
- **[shadcn/ui](https://ui.shadcn.com)** components built on
  **[`@base-ui/react`](https://base-ui.com)**, styled with Tailwind CSS v4
- **[Vitest](https://vitest.dev)** + **React Testing Library** for unit and
  integration tests

## Decisions worth explaining

- **The nested API response is flattened once, at the data layer.** Rather
  than filtering through `phases → rounds → matches` everywhere a component
  needs the fixture, `flattenFixture()` collapses it into a single
  `FlatMatch[]` immediately after fetch, carrying `roundNumber`/`roundName`
  forward onto each match. Every component downstream works with one flat
  list.
- **TanStack Query instead of `fetch` + `useEffect`.** The fixture is fetched
  once and doesn't change mid-session, so it's cached with a one-hour
  `staleTime` rather than re-fetched on every mount or filter change.
  Selecting a filter never triggers a new network request, it just narrows
  what's rendered from the already-cached list.
- **Controlled filter components**, with `page.tsx` owning the selected
  round/venue/team as state and passing it down, rather than uncontrolled
  selects managing their own internal state. This keeps all three filters
  combinable through one predictable `.filter()` chain instead of each
  filter having to coordinate with the others independently.
- **Defensive handling of incomplete fixture data.** The live API includes
  bye rounds (a real match object against a placeholder "Bye" team, with no
  venue) and at least one fixture slot missing its scheduled date. `date`,
  `venue`, and each side of `squads` are typed as optional, and `MatchCard`
  renders sensible fallbacks ("Venue TBC", "Date TBC") rather than assuming
  every field is always present.
- **Pagination slices the already-filtered list client-side, not the
  fetch.** The fixture endpoint returns the entire season in one response
  with no page/limit params to request, so there's no server-side page to
  ask for. `page.tsx` filters first, then slices the result into 15-card
  pages (`PAGE_SIZE`), so the page count always reflects what's actually
  visible under the current filters rather than the whole season. Picking a
  new filter resets back to page 1 - that reset is done by comparing the
  current round/venue/team against the previous render's values and calling
  `setState` directly in the render body (the pattern React's own docs
  recommend for "adjust state when a prop changes"), rather than in a
  `useEffect`. A `useEffect` would work too, but it costs an extra
  render-then-correct pass and trips the same `react-hooks/set-state-in-effect`
  lint rule that came up once already this project, when the footer's
  copyright year needed the equivalent fix.

## What's intentionally left out

No backend, authentication, or database — per the brief's scope, this is a
read-only client fetching directly from the provided public API.

## Project structure

```
app/                  Next.js App Router pages, layout, and providers
components/layout/    Site chrome: Header (title) and Footer (copyright)
components/fixture/   The fixture UI: MatchCard, MatchList, Pagination, and the three filters
components/ui/        shadcn/ui primitives (Select, Card, Badge, Label, ...)
hooks/useFixture.ts   TanStack Query hook that fetches + flattens the fixture
lib/fixture.ts        Fetching, flattening, and filter-option logic
lib/types.ts          TypeScript types matching the fixture API's response shape
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

Tests use Vitest with jsdom and React Testing Library, covering:

- `lib/fixture.ts` — `flattenFixture()`, the `getRounds`/`getVenues`/`getTeams` helpers, and `fetchFixture()`'s error handling
- `useFixture` — the query hook's loading/success/error states, with `fetchFixture` mocked
- `MatchCard` — team/venue/date fallbacks, score display, and decorative logo alt text
- `VenueFilter`, `RoundFilter`, `TeamFilter` — rendering, selection, and the "all" reset option
- `MatchList` — loading, error, empty, and populated states
- `Pagination` — disabled states at the first/last page, click handlers, and hiding itself at one page
- An end-to-end integration test of the page — mocked fetch, driving the filters, paging through a 40-match fixture, and asserting the page resets when a filter changes

Run the test suite once:

```bash
npm test
```

Or in watch mode while developing:

```bash
npm run test:watch
```

## Deployment

Live: https://afl-fixture-client.vercel.app
Repo: https://github.com/we2annor/afl-fixture-client

Hosted on Vercel, connected to this repo — every push to `main` triggers a
new production deployment automatically.

## Other scripts

```bash
npm run build   # production build
npm start       # run the production build (after `npm run build`)
npm run lint    # ESLint
```
