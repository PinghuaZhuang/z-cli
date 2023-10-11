import puppeteer, { Page } from 'puppeteer';
import path from 'path';

export function sleep(delay: number) {
  return new Promise(resolve => setTimeout(resolve, delay))
}

export default async function (cb: (page: Page) => Promise<unknown>, url: string) {
  return new Promise(async (resove, reject) => {
    const datadir = path.resolve(__dirname, '../tmp/profile/');
    const browser = await puppeteer.launch({
      headless: true,
      // openInExistingWindow: true,
      ignoreHTTPSErrors: true,
      userDataDir: datadir,
      args: [],
    });

    const page = await browser.newPage();

    await page.setUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.0 Safari/537.36',
    );

    page.once('load', async () => {
      const result  = await cb(page);
      await browser.close();
      resove(result);
    });

    await page.goto(url);
  })
}
