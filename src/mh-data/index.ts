/**
 * @file 获取梦幻模拟战手游数据
 */
import { sleep } from '@/utils';
import { getWeapons } from './weapons';
import fs from 'fs';

(async () => {
  const weaponDatas = await getWeapons();
  console.log('>>> 获取的武器数据:', weaponDatas);
})();
