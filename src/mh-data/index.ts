/**
 * @file 获取梦幻模拟战手游数据
 */
import { getWeapons, weapons2Json } from './weapons';
import path from 'path';
import { writeJsonFile } from '@/utils';
import dayjs from 'dayjs';

(async () => {
  const weaponDatas = weapons2Json(await getWeapons());
  // console.log('>>> 获取的武器数据:', weaponDatas);

  await writeJsonFile(
    path.resolve(__dirname, `../../data/mn/weapons.json`),
    JSON.stringify(
      {
        updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        data: weaponDatas,
      },
      null,
      2,
    ),
  ).then(console.log);
})();
