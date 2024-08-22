/**
 * @file 获取梦幻模拟战手游数据
 */
import { getWeapons, weapons2Json } from './weapons';
import fs from 'fs';
import path from 'path';

(async () => {
  const weaponDatas = weapons2Json(await getWeapons());
  // console.log('>>> 获取的武器数据:', weaponDatas);

  fs.writeFile(
    path.resolve(__dirname, `../../data/mn/weapons.json`),
    JSON.stringify(weaponDatas, null, 2),
    'utf-8',
    (err) => {
      if (err) return err;
      console.log(`>>> 武器数据写入成功.`);
    },
  );
})();
