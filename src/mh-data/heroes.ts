/**
 * @file 自动兑换福利码
 * 网友收集的兑换码: wiki.biligame.com/langrisser
 */
import openChrome from '@/utils/openChrome';
import { sleep } from '@/utils';
import { getWeapons } from './weapons';

interface Hero {
  attack: number;

}

/**
 * 获取英雄数据
 */
async function getHeroes() {
  return openChrome(async (page) => {
    await sleep(10_000);
    const element = await page.waitForSelector('#load');
    if (element == null) {
      console.error(`获取 #load 元素失败`);
      return;
    }
    await element.click();
    await sleep(10_000);
    return await page.$$eval('.bikited-copy', (_) =>
      _.map((o) => (o as HTMLSpanElement).innerText),
    );
  }, 'https://wiki.biligame.com/langrisser/Giftcode');
}
