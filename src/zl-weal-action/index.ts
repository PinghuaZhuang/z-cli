import axios from 'axios';
import { notifyWithBark } from '@/utils/notify';
import { getUsers } from '@/utils';

const mzUrl = 'http://activity.zlongame.com';

function draw({ roleid, server: ext1 }: { roleid: string; server: string }) {
  return axios
    .get(`${mzUrl}/activity/cmn/lot/wheel.do`, {
      params: {
        key: 'mz_wx_reward',
        roleid,
        ext1,
      },
    })
    .then(({ data: { data } }) => {
      console.log('Draw Result:', data);
      const roleidChunk = roleid.slice(roleid.length - 4, roleid.length);
      if (data.success) {
        return Promise.resolve(`${roleidChunk}: 恭喜您！抽中${data.info.name}`);
      }
      switch (Number.parseInt(data.code)) {
        case 15:
          return Promise.resolve(
            `${roleidChunk}: 本周您已经抽取过奖励啦～\n已为您发放奖励，请前往游戏内邮箱查看`,
          );
        case 24:
          return Promise.resolve(
            `${roleidChunk}: 抽奖活动将于周二开启\n请指挥官耐心等待哦~`,
          );

        default:
          return Promise.reject(`系统异常: ${ext1}: ${roleid}`);
      }
    });
}

(async () => {
  Promise.allSettled((await getUsers()).map(draw)).then((values) => {
    notifyWithBark(
      `周二福利官`,
      values
        .reduce((pre, cur) => {
          // @ts-ignore
          return pre + (cur.value ?? cur.reason) + '\n';
        }, '')
        .replace(/\n$/, ''),
    );
  });
})();
