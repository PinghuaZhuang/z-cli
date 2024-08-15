/**
 * @file 自动兑换福利码
 * 网友收集的兑换码: wiki.biligame.com/langrisser/%E5%85%91%E6%8D%A2%E7%A0%81
 */
import openChrome from '@/utils/openChrome';
import { difference } from 'lodash';
import exchange from '@/commands/mh/zilong';
import { notifyWithBark } from '@/utils/notify';
import { getIssues, setIssues, sleep } from '@/utils';
import dayjs from 'dayjs';

async function getCdkeys() {
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

async function setCacheKeys(keys: string[]) {
  return setIssues(keys.join(','), 1);
}

async function getCacheKeys() {
  return getIssues(1);
}

(async () => {
  const cacheKeys = (await getCacheKeys()).split(',');
  const keys = (await getCdkeys()) as string[];
  const newKeys = difference(keys, cacheKeys).splice(0, 10);
  console.log(`>>> 获取到的首页所有礼包码: ${keys.join(', ')}`);

  if (newKeys.length <= 0) {
    console.log(`>>> 今日没有礼包码.`);
    return;
  }

  notifyWithBark(
    `${dayjs().format('YYYY-MM-DD')} 有新的礼包码`,
    newKeys.join(','),
  );

  await Promise.allSettled(newKeys.map(exchange));
  await setCacheKeys(keys);
})();
