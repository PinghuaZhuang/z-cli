import puppeteer, { Page } from 'puppeteer';
import path from 'path';

export default async function <T extends unknown>(
  cb: (page: Page) => Promise<T>,
  url: string,
) {
  return new Promise<T>(async (resove, reject) => {
    const datadir = path.resolve(__dirname, '../tmp/profile/');
    const browser = await puppeteer.launch({
      headless: 'new',
      // openInExistingWindow: true,
      ignoreHTTPSErrors: true,
      userDataDir: datadir,
      args: ['--no-sandbox'],
    });

    const page = await browser.newPage();

    await page.setUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.0 Safari/537.36',
    );

    page.once('load', async () => {
      const result = await cb(page);
      await browser.close();
      resove(result);
    });

    await page.goto(url);
  });
}
