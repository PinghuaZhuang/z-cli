/**
 * @file 自动兑换福利码
 * 网友收集的兑换码: wiki.biligame.com/langrisser
 */
import openChrome from '@/utils/openChrome';
import { sleep } from '@/utils';

export const BASE_URL = `https://wiki.biligame.com/langrisser`;
const separator = ';';

interface Weapon {
  name: string;
  HP: number;
  STR: number;
  ATS: number;
  DEF: number;
  ADF: number;
  SKILL: number;
  img: string;
  url: string;
  hero: null | { name: string; url: string; img: string };
}

export function weapons2Json(weapons: Weapon[]) {
  const result = {} as { [prop: string]: Weapon };
  weapons.forEach((data) => {
    result[data.name] = data;
  });
  return result;
}

/**
 * 获取武器数据
 */
export async function getWeapons() {
  return await openChrome<Weapon[]>(async (page) => {
    console.log(`>>> 开始获取武器数据...`);
    await sleep(5_000);
    const element = await page.waitForSelector('#CardSelectTr tbody');
    if (element == null) {
      console.error(`获取 #load 元素失败`);
      return Promise.reject(`获取 #load 元素失败`);
    }

    return await element.$$eval(`tr.divsort.itemhover`, (trs, separator) => {
      function cleanNumber(data: string) {
        const result = data.split('/').at(-1);
        return result ? +result : 0;
      }

      const weaponDatas: Weapon[] = [];
      trs.forEach((tr) => {
        const tds = tr.querySelectorAll<HTMLTableCellElement>(`td:not(td td)`);
        const data = Array.from(tds).map((td, index) => {
          if (td == null) return '';

          switch (index) {
            case 0:
              const avatar = td.querySelector(
                'div.equip_img img',
              ) as HTMLImageElement;
              const aTag = td.querySelector(
                'div.equip_name a',
              ) as HTMLAnchorElement;
              return avatar ? `${avatar.src}${separator}${aTag.href}` : '';
            case 2:
              const img = td.querySelector('img');
              const a = td.querySelector('a');
              if (img == null || a == null) return '';
              return `${img.alt.split(' ').at(-1)}${separator}${
                img.src
              }${separator}${a.href}`;

            default:
              break;
          }

          return td.innerText;
        });

        const name = data[1].split('.')[0];
        const heroArr = data[2].split(separator);
        if (!name) return;
        const tmp = data[0].split(separator);
        weaponDatas.push({
          name,
          HP: cleanNumber(data[5]),
          STR: cleanNumber(data[6]),
          ATS: cleanNumber(data[7]),
          DEF: cleanNumber(data[8]),
          ADF: cleanNumber(data[9]),
          SKILL: cleanNumber(data[10]),
          img: tmp[0],
          url: tmp[1],
          hero: data[2]
            ? {
                name: heroArr[0],
                img: heroArr[1],
                url: heroArr[2],
              }
            : null,
        });
      });

      console.log(`>>> 武器数据获取成功.`);
      return weaponDatas;
    }, separator);
  }, `${BASE_URL}/%E8%A3%85%E5%A4%87%E6%95%B0%E6%8D%AE%E8%A1%A8`);
}
