# Optional Bonus: Accessibility Testing Considerations

If I had a bit more time on this assignment, accessibility is the bonus area I would explore first. It fits naturally with an automation role and adds value without forcing a large expansion of the test suite.

## Recommended Approach

- Use `@axe-core/playwright` for automated checks on key states:
  - Landing map page after load.
  - Trip creation form.
  - Launched itinerary panel.
  - Account prompt for saving progress.
- Fail CI only on serious or critical violations at first.
- Track moderate/minor findings separately so they can be triaged without creating noisy PR failures.

## What Automated Checks Can Catch

- Missing accessible names on controls.
- Invalid ARIA usage.
- Form labeling problems.
- Keyboard focus issues that axe can detect.
- Structural problems in dialogs or panels.

## What Still Needs Manual Review

- Full keyboard-only route creation.
- Screen reader quality of dynamic map and itinerary updates.
- Focus management after autocomplete selection and route launch.
- Whether map interactions have usable non-pointer alternatives.
- Color contrast if brand styles or map overlays need product/design review.

## Assessment Trade-Off

For this submission, I kept accessibility as a short strategy note instead of adding it to the main automated suite. During local review of the public site, automated checks surfaced several critical issues on icon-only controls and third-party UI elements. I did not want the optional bonus to turn into a failing test that distracted from the core assignment.

In a real team setting, I would still add accessibility automation, but I would do it with agreed scope, ownership, and pass/fail thresholds instead of dropping it into CI blindly.
