import axios from 'axios';
import { notifyWithBark } from '../utils/notify';
import { parseSecretToArr } from '../utils';

const mzUrl = 'http://activity.zlongame.com';

function draw([roleid, ext1]: [string, string]) {
  return axios
    .get(`${mzUrl}/activity/cmn/lot/wheel.do`, {
      params: {
        key: 'mz_wx_reward',
        roleid,
        ext1,
      },
    })
    .then(({ data: { data } }) => {
      if (data.success) {
        return Promise.resolve(`${ext1}: 恭喜您！抽中${data.info.name}`);
      }
      switch (Number.parseInt(data.code)) {
        case 15:
          return Promise.resolve(
            `${ext1}: 本周您已经抽取过奖励啦～\n已为您发放奖励，请前往游戏内邮箱查看`,
          );
        case 24:
          return Promise.resolve(
            `${ext1}: 抽奖活动将于周二开启\n请指挥官耐心等待哦~`,
          );

        default:
          return Promise.reject(`系统异常: ${ext1}: ${roleid}`);
      }
    });
}

Promise.allSettled(
  (parseSecretToArr(process.env.ZL_USERS!) as [string, string][]).map(draw),
).then((values) => {
  notifyWithBark(
    `周二福利官`,
    values.reduce((pre, cur) => {
      // @ts-ignore
      return pre + cur.value ?? cur.reason;
    }, ''),
  );
});
