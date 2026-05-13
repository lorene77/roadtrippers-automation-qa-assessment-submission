# Roadtrippers Automation QA Assessment

This repo contains my submission for the Roadpass Digital Automation QA Engineer assessment.

I used Playwright with TypeScript and focused on the public trip-planning flow at `https://maps.roadtrippers.com`. Since no demo account was provided, I treated authenticated persistence under `My trips` as out of scope and validated the public flow up to the account-creation gate instead.

## What is included

- Part 1: a runnable Playwright test suite with Page Object Model structure
- Part 2: a short CI/CD strategy document plus a sample CircleCI config
- Part 3: a brief note on how I would approach accessibility testing for this flow

## Test coverage

The suite covers three scenarios:

1. Happy path
   Creates a trip from Chicago to Madison with Milwaukee as a stop, launches the trip, and verifies the public save/account prompt.

2. Edge case
   Verifies the free public waypoint limit messaging once the trip reaches the observed free limit.

3. Negative scenario
   Attempts to create a trip with required route fields left blank and verifies that the inputs are marked invalid.

## Project structure

```text
.
|-- .circleci/
|   `-- config.yml
|-- part1-automation/
|   |-- pages/
|   |   `-- TripPlannerPage.ts
|   |-- test-data/
|   |   `-- tripLocations.ts
|   `-- tests/
|       `-- trip-planning.spec.ts
|-- part2-ci-strategy/
|   |-- ci-cd-strategy.md
|   `-- config.yml
|-- part3-bonus/
|   `-- accessibility-notes.md
|-- playwright.config.ts
|-- package.json
|-- package-lock.json
`-- tsconfig.json
```

## Setup

```bash
npm install
npx playwright install --with-deps
```

## Running the tests

```bash
npm test
```

For debugging:

```bash
npm run test:headed
npm run report
npm run lint
```

## Notes and trade-offs

I kept the suite intentionally small and stable. Because this is a live production site, I chose scenarios that are high value but still predictable enough to automate without introducing brittle assumptions.

I did not use a personal account in the tests. The public flow allows itinerary creation and trip launch, but saving a trip to an account is gated behind account creation or login. I treated that gate as expected behavior and asserted it directly.

I also avoided cases like complex geography, membership-only behavior, and account persistence because they would add risk without improving the signal of the assessment.

## CI and bonus

The CI strategy is in [ci-cd-strategy.md](/C:/Users/irina_25cz9jv/Documents/Codex/2026-05-13/we-need-to-reassess-the-assignment/part2-ci-strategy/ci-cd-strategy.md), and the runnable CircleCI config is in [.circleci/config.yml](/C:/Users/irina_25cz9jv/Documents/Codex/2026-05-13/we-need-to-reassess-the-assignment/.circleci/config.yml).

For the optional bonus, I included a short accessibility approach in [accessibility-notes.md](/C:/Users/irina_25cz9jv/Documents/Codex/2026-05-13/we-need-to-reassess-the-assignment/part3-bonus/accessibility-notes.md) instead of submitting a failing automated accessibility test against the live public site.

## Time spent

Approximate time spent: 5 hours
