import type { Page, TestInfo } from '@playwright/test';

export const ENCATCH_IFRAME = 'iframe[src*="encatch"]';

export type FooterModalTrigger = 'Yes' | 'No' | 'Suggest edits' | 'Raise issue';

export async function saveScreenshot(
  page: Page,
  testInfo: TestInfo,
  filename: string,
  options?: { fullPage?: boolean; locator?: ReturnType<Page['locator']> },
) {
  const path = testInfo.outputPath(filename);
  if (options?.locator) {
    await options.locator.screenshot({ path });
    return;
  }
  await page.screenshot({ path, fullPage: options?.fullPage ?? false });
}

/** Viewport-only capture for modal screenshots (see saveModalScreenshot). */
export async function saveModalScreenshot(
  page: Page,
  testInfo: TestInfo,
  filename: string,
) {
  await saveScreenshot(page, testInfo, filename);
}

export async function scrollToFooter(page: Page) {
  const yesButton = page.getByRole('button', { name: 'Yes', exact: true });
  const suggestEditsButton = page.getByRole('button', { name: 'Suggest edits', exact: true });
  const raiseIssueButton = page.getByRole('button', { name: 'Raise issue', exact: true });

  await yesButton.waitFor({ state: 'visible', timeout: 15_000 });
  await suggestEditsButton.waitFor({ state: 'visible', timeout: 15_000 });
  await raiseIssueButton.waitFor({ state: 'visible', timeout: 15_000 });

  const byClass = page
    .locator('.docs-page-feedback, .encatch-docs-feedback, .encatch-feedback')
    .filter({ has: suggestEditsButton })
    .first();
  if (await byClass.count()) {
    await raiseIssueButton.scrollIntoViewIfNeeded();
    await byClass.scrollIntoViewIfNeeded();
    return byClass;
  }

  // Outermost wrapper that contains the full footer row (not just the Yes/No group).
  const feedbackBlock = page
    .locator('div, section, footer, article')
    .filter({ hasText: 'Was this page helpful?' })
    .filter({ has: yesButton })
    .filter({ has: suggestEditsButton })
    .filter({ has: raiseIssueButton })
    .last();

  await raiseIssueButton.scrollIntoViewIfNeeded();
  await feedbackBlock.scrollIntoViewIfNeeded();
  return feedbackBlock;
}

export async function waitForEncatchSdk(page: Page) {
  await page
    .waitForFunction(
      () => typeof (window as Window & { _encatch?: unknown })._encatch !== 'undefined',
      { timeout: 15_000 },
    )
    .catch(() => {
      throw new Error(
        'Encatch SDK did not load. Seed .env with a publishable key (run documentation-platforms/run-visual-tests.sh).',
      );
    });
}

export async function waitForEncatchModalContent(page: Page) {
  const iframe = page.locator(ENCATCH_IFRAME).first();
  await iframe.waitFor({ state: 'visible', timeout: 30_000 });

  const frame = page.frameLocator(ENCATCH_IFRAME).first();
  await frame.locator('button').first().waitFor({ state: 'visible', timeout: 30_000 });

  // Iframe height grows as the form replaces the loader skeleton — wait for layout to settle.
  let stableChecks = 0;
  let previousHeight = -1;
  const deadline = Date.now() + 5_000;
  while (stableChecks < 3 && Date.now() < deadline) {
    const height = await iframe.evaluate((el) => el.getBoundingClientRect().height);
    if (height === previousHeight && height > 0) {
      stableChecks += 1;
    } else {
      stableChecks = 0;
      previousHeight = height;
    }
    await page.waitForTimeout(150);
  }
}

export async function openEncatchModalFromFooter(
  page: Page,
  trigger: FooterModalTrigger,
) {
  await waitForEncatchSdk(page);
  await page.getByRole('button', { name: trigger, exact: true }).click();
  await waitForEncatchModalContent(page);
}
