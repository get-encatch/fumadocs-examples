import { test } from '@playwright/test';
import {
  openEncatchModalFromFooter,
  saveModalScreenshot,
  saveScreenshot,
  scrollToFooter,
  type FooterModalTrigger,
} from './helpers';

const homePath = '/docs';
const docsFeedbackPath = '/docs/docs-feedback';

const modalScenarios: Array<{
  id: string;
  trigger: FooterModalTrigger;
  filename: string;
  label: string;
}> = [
  { id: '04', trigger: 'Yes', filename: '04-encatch-modal-yes.png', label: 'yes' },
  { id: '05', trigger: 'No', filename: '05-encatch-modal-no.png', label: 'no' },
  {
    id: '06',
    trigger: 'Suggest edits',
    filename: '06-encatch-modal-suggest-edit.png',
    label: 'suggest edit',
  },
  {
    id: '07',
    trigger: 'Raise issue',
    filename: '07-encatch-modal-raise-issue.png',
    label: 'raise issue',
  },
];

test.describe.configure({ mode: 'serial' });

test('01 home', async ({ page }, testInfo) => {
  await page.goto(homePath);
  await page.waitForLoadState('networkidle');
  await saveScreenshot(page, testInfo, '01-home.png', { fullPage: true });
});

test('02 docs-feedback page', async ({ page }, testInfo) => {
  await page.goto(docsFeedbackPath);
  await page.getByRole('heading', { name: /Get the feedback form/i }).waitFor();
  await saveScreenshot(page, testInfo, '02-docs-feedback.png', { fullPage: true });
});

test('03 footer widget', async ({ page }, testInfo) => {
  await page.goto(docsFeedbackPath);
  const footer = await scrollToFooter(page);
  await saveScreenshot(page, testInfo, '03-footer.png', { locator: footer });
});

for (const { id, trigger, filename, label } of modalScenarios) {
  test(`${id} encatch modal ${label}`, async ({ page }, testInfo) => {
    await page.goto(docsFeedbackPath);
    await scrollToFooter(page);
    await openEncatchModalFromFooter(page, trigger);
    await saveModalScreenshot(page, testInfo, filename);
  });
}
