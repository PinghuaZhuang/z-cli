import axios from 'axios';
import { notifyWithBark } from '../utils/notify';

const mzUrl = '//activity.zlongame.com';
const userName = `周二福利官`;

const throwError = () => {
  notifyWithBark(
    userName,
    `系统异常: ${process.env.ZL_ROLEID}, ${process.env.ZL_SERVERID}`,
  );
};

axios
  .post(`${mzUrl}/activity/cmn/lot/wheel.do`, {
    data: {
      key: 'mz_wx_reward',
      roleid: process.env.ZL_ROLEID,
      ext1: process.env.ZL_SERVERID,
    },
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      Referer: 'http://activity.zlongame.com/',
    },
  })
  .then((res) => {
    if (res.data.success) {
      notifyWithBark(userName, `恭喜您！抽中${res.data.info.name}`);
    } else {
      if (res.data.code == 15) {
        notifyWithBark(
          userName,
          `本周您已经抽取过奖励啦～\n已为您发放奖励，请前往游戏内邮箱查看`,
        );
      } else if (res.data.code == 24) {
        notifyWithBark(userName, `抽奖活动将于周二开启\n请指挥官耐心等待哦~`);
      } else {
        throwError();
      }
    }
  })
  .catch(throwError);
