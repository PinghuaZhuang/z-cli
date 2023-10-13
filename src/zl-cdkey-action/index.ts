/**
 * @file 自动兑换福利码
 * 网友收集的兑换码: wiki.biligame.com/langrisser/%E5%85%91%E6%8D%A2%E7%A0%81
 */
import openChrome, { sleep } from '@/utils/openChrome';
import axios from 'axios';
import dayjs from 'dayjs';
import { difference } from 'lodash';
import exchange from '@/commands/mh/zilong';
import { notifyWithBark } from '@/utils/notify';

const token = process.env.TOKEN;

async function getCdkeys() {
  return openChrome(async (page) => {
    const element = await page.waitForSelector('#load');
    if (element == null) {
      console.error(`获取 #load 元素失败`);
      return;
    }
    await element.click();
    await sleep(3000);
    return await page.$$eval('.bikited-copy', (_) =>
      _.map((o) => (o as HTMLSpanElement).innerText),
    );
  }, 'https://wiki.biligame.com/langrisser/%E5%85%91%E6%8D%A2%E7%A0%81');
}

async function setCacheKeys(keys: string[]) {
  return axios.patch(
    'https://api.github.com/repos/pinghuazhuang/z-cli/issues/1',
    {
      title: dayjs().format('YYYY-MM-DD'),
      body: keys.join(','),
    },
    {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `token ${token}`,
      },
    },
  );
}

async function getCacheKeys() {
  const result = await axios.get(
    'https://api.github.com/repos/pinghuazhuang/z-cli/issues/1',
    {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `token ${token}`,
      },
    },
  );
  return result.data.body;
}

(async () => {
  const cacheKeys = (await getCacheKeys()).split(',');
  const keys = (await getCdkeys()) as string[];
  const newKeys = difference(keys, cacheKeys);
  console.log(`>>> 获取到的首页所有礼包码: ${keys.join(', ')}`);

  if (newKeys.length <= 0) {
    console.log(`>>> 今日没有礼包码.`);
    return;
  }

  notifyWithBark('有新的礼包码', newKeys.join(','));

  await Promise.allSettled(newKeys.map(exchange));
  await setCacheKeys(keys);
})();
