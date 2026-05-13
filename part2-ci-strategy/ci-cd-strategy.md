# CI/CD Integration Strategy

The goal of the CI setup is straightforward: run the Playwright trip-planning tests on every pull request so regressions are visible before code is merged.

## When the tests should run

I would run this suite on every pull request to the main branch. For a team using the suite beyond the assessment, I would also add a nightly scheduled run against production to catch drift caused by third-party dependencies or live-site changes.

## How I would configure the pipeline

I would use the official Playwright Docker image in CircleCI so the browser and OS dependencies stay consistent between local and CI runs. The job should:

1. Check out the repo
2. Restore the npm cache
3. Run `npm ci`
4. Run `npm run lint`
5. Run `npm test`
6. Publish test results and Playwright artifacts

I would start with Chromium only and two workers in CI. That is enough for this suite and keeps the signal clear. If the suite grows later, parallelism can be revisited based on actual runtime data.

## Reporting and failures

I would publish:

- JUnit XML for CircleCI test results
- the Playwright HTML report as a build artifact
- screenshots, traces, and videos on failure

That gives enough information to debug most failures without rerunning locally first.

For notifications, I would keep the initial setup simple and rely on GitHub checks plus CircleCI results. Slack alerts are useful later, but only when the team has agreed on which failures are worth interrupting people for.

## Flaky test strategy

I would allow one retry in CI, but only to reduce noise from transient browser or network behavior. A test that passes only on retry should still be treated as suspect.

If a test proves flaky, I would not leave it in a permanent half-broken state. The normal path should be:

1. identify it through retry behavior or inconsistent reruns
2. assign an owner
3. decide whether it should be fixed immediately or temporarily quarantined
4. track the root cause and resolution

I would avoid blanket retries and avoid normalizing quarantine as a substitute for maintenance.

## Metrics I would track

1. Pass rate
   This tells me whether the suite is trustworthy as a merge gate.

2. Flake rate by test
   This helps separate product failures from automation reliability problems.

3. Average and p95 duration
   This shows when the suite is getting too slow and whether more parallelization is justified.

4. Failure category
   I would classify failures as product issue, test issue, environment issue, or external dependency issue so the team can see where the noise is actually coming from.

## Closing note

For this assessment, I kept the CI design pragmatic. The suite is small, so the right starting point is a simple, reproducible pipeline with useful artifacts and a clear flake policy, not an overbuilt workflow.
