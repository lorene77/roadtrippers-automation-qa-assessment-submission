import { test } from '@playwright/test';
import { TripPlannerPage } from '../pages/TripPlannerPage';
import { chicago, madison, milwaukee } from '../test-data/tripLocations';

test.describe('Roadtrippers public trip planning flow', () => {
  test('happy path: creates and launches a public trip with a waypoint', async ({ page }) => {
    const tripPlanner = new TripPlannerPage(page);

    await tripPlanner.open();
    await tripPlanner.createTripFromStartAndDestination(chicago, madison);
    await tripPlanner.addStopDuringOnboarding(milwaukee);
    await tripPlanner.expectTripContains([chicago, milwaukee, madison]);
    await tripPlanner.launchTrip();

    await tripPlanner.expectTripContains([chicago, milwaukee, madison]);
    await tripPlanner.expectAccountPromptForSaving();
  });

  test('edge case: shows the public free waypoint limit after three trip stops', async ({ page }) => {
    const tripPlanner = new TripPlannerPage(page);

    await tripPlanner.open();
    await tripPlanner.createTripFromStartAndDestination(chicago, madison);
    await tripPlanner.addStopDuringOnboarding(milwaukee);
    await tripPlanner.launchTrip();

    await tripPlanner.expectFreeWaypointLimitMessage();
  });

  test('negative: does not create a trip when required locations are blank', async ({ page }) => {
    const tripPlanner = new TripPlannerPage(page);

    await tripPlanner.open();
    await tripPlanner.submitEmptyTripForm();

    await tripPlanner.expectRequiredFieldsHighlighted();
  });
});
