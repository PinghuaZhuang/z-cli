import axios from 'axios';
import CliTable from 'cli-table';
import { parseSecretToArr } from '@/utils';

type UserInfo = {
  roleid: string;
  server: string;
};

const users: UserInfo[] = parseSecretToArr(process.env.ZL_USERS!).map(o => ({
  roleid: o[0],
  server: o[1],
}));

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
    table.push([
      users[index].roleid,
      o.status === 'fulfilled' && o.value.status === '200' ? '✔' : '❌',
    ]);
  });
  console.log(table.toString());
  process.exit();
}
