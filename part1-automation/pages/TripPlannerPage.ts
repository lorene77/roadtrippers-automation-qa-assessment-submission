import { expect, type Locator, type Page } from '@playwright/test';
import type { TripLocation } from '../test-data/tripLocations';

export class TripPlannerPage {
  readonly page: Page;
  readonly originInput: Locator;
  readonly destinationInput: Locator;
  readonly createTripButton: Locator;
  readonly launchTripButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.originInput = page.locator('#origin');
    this.destinationInput = page.locator('#destination');
    this.createTripButton = page.getByRole('button', { name: /Create trip/i });
    this.launchTripButton = page.getByRole('button', { name: /Launch trip/i });
  }

  async open(): Promise<void> {
    await this.page.goto('/');
    await this.acceptCookiesIfVisible();
    await expect(this.page.getByRole('button', { name: 'Start Trip' })).toBeVisible();
  }

  async acceptCookiesIfVisible(): Promise<void> {
    const acceptCookiesButton = this.page.locator('#onetrust-accept-btn-handler');
    const allowAllButton = this.page.locator('#accept-recommended-btn-handler');
    const closePreferencesButton = this.page.locator('#close-pc-btn-handler');
    const darkOverlay = this.page.locator('#onetrust-consent-sdk .onetrust-pc-dark-filter');

    if (await acceptCookiesButton.isVisible().catch(() => false)) {
      await acceptCookiesButton.click({ timeout: 5_000, force: true }).catch(() => undefined);
    }

    if (await allowAllButton.isVisible().catch(() => false)) {
      await allowAllButton.click({ timeout: 5_000, force: true }).catch(() => undefined);
    }

    if (await closePreferencesButton.isVisible().catch(() => false)) {
      await closePreferencesButton.click({ timeout: 5_000, force: true }).catch(() => undefined);
    }

    await expect(darkOverlay).toBeHidden({ timeout: 5_000 }).catch(() => undefined);
  }

  async openTripForm(): Promise<void> {
    await this.acceptCookiesIfVisible();
    await this.page.getByRole('button', { name: 'Start Trip' }).click();
    await expect(this.page.getByText('Where are you going?')).toBeVisible();
    await expect(this.originInput).toBeVisible();
    await expect(this.destinationInput).toBeVisible();
  }

  async selectStartingPoint(location: TripLocation): Promise<void> {
    await this.selectLocation(this.originInput, location);
  }

  async selectDestination(location: TripLocation): Promise<void> {
    await this.selectLocation(this.destinationInput, location);
  }

  async createTripFromStartAndDestination(start: TripLocation, destination: TripLocation): Promise<void> {
    await this.openTripForm();
    await this.selectStartingPoint(start);
    await this.selectDestination(destination);
    await expect(this.createTripButton).toBeEnabled();
    await this.createTripButton.click();
    await expect(this.page.getByText('Do you have any places you already plan to visit?')).toBeVisible();
  }

  async addStopDuringOnboarding(location: TripLocation): Promise<void> {
    await this.selectLocation(this.originInput, location);
    await expect(this.page.getByText(location.display, { exact: false })).toBeVisible();
  }

  async launchTrip(): Promise<void> {
    await expect(this.launchTripButton).toBeEnabled();
    await this.launchTripButton.click();
    await expect(this.page.getByText("Don't lose your progress")).toBeVisible();
  }

  async expectTripContains(locations: TripLocation[]): Promise<void> {
    for (const location of locations) {
      await expect(this.page.getByText(location.display, { exact: false }).first()).toBeVisible();
    }
  }

  async expectAccountPromptForSaving(): Promise<void> {
    await expect(this.page.getByText("Don't lose your progress")).toBeVisible();
    await expect(this.page.getByText('Create an account', { exact: true })).toBeVisible();
  }

  async expectFreeWaypointLimitMessage(): Promise<void> {
    await expect(this.page.getByText('No Free Waypoints Left')).toBeVisible();
    await expect(this.page.getByText(/Free trips are limited to 3 waypoints/i)).toBeVisible();
  }

  async submitEmptyTripForm(): Promise<void> {
    await this.openTripForm();
    await this.createTripButton.click();
  }

  async expectRequiredFieldsHighlighted(): Promise<void> {
    await expect(this.originInput.locator('xpath=ancestor::div[contains(@class, "origin-input")]')).toHaveClass(/has-error/);
    await expect(this.destinationInput.locator('xpath=ancestor::div[contains(@class, "destination-input")]')).toHaveClass(/has-error/);
  }

  private async selectLocation(input: Locator, location: TripLocation): Promise<void> {
    await input.fill(location.search);
    const result = this.page
      .locator('.rt-autocomplete-list-item-view')
      .filter({ hasText: location.result })
      .first();

    await expect(result).toBeVisible();
    await result.click();
  }
}
