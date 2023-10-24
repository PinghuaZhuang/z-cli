import axios from 'axios';
import CliTable from 'cli-table';
import { getUsers } from '@/utils';

const successCode = {
  115: '兑换成功',
  104: '礼包码已使用',
  114: '礼包码已使用',
};

const failCode = {
  101: '礼包码不存在',
  102: '礼包码不存在',
  113: '当前礼包码在该渠道下不能使用',
  108: '当前礼包码已过期',
  111: '同类型礼包码无法重复使用',
};

type UserInfo = {
  roleid: string;
  server: string;
};

async function enterUserInfo(userInfo: UserInfo, code: string) {
  return axios
    .post(
      `https://activity.zlongame.com/activity/cmn/card/csmweb.do`,
      {
        appkey: '1486458782785',
        card_user: userInfo.roleid,
        card_channel: '0123456789',
        card_server: userInfo.server,
        card_role: userInfo.roleid,
        card_code: code,
        type: '2',
      },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          Referer: 'https://www.zlongame.com/',
        },
      },
    )
    .then((res) => res.data);
}

export default async function exchange(code: string) {
  const users: UserInfo[] = await getUsers();

  for (const [k, v] of Object.entries(users)) {
    await enterUserInfo(v, code);
  }
  const result = await Promise.allSettled(
    users.map(async (o) => await enterUserInfo(o, code)),
  );
  const table = new CliTable({
    style: {
      head: ['green'],
    },
  });

  result.forEach((o, index) => {
    const infoCode = o.status === 'fulfilled' ? String(o.value.info) : 'error';

    table.push([
      users[index].roleid,
      o.status === 'fulfilled' &&
      // @ts-ignore
      successCode[infoCode]
        ? '✔'
        : '❌',
      // @ts-ignore
      successCode[infoCode] ?? failCode[infoCode] ?? '兑换失败',
    ]);
  });
  console.log(`code: ${code}`);
  console.log(table.toString());
}
