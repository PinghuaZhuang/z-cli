import axios from 'axios';
import dayjs from 'dayjs';

const token = process.env.TOKEN;

/**
 * 解析 secret 为数组
 * @example name:msg,name2:msg2 => [[name, msg], [name2, msg2]]
 */
export function parseSecretToArr(secret: string): string[][] {
  return secret
    .split(',')
    .map((o) => o?.trim().split(':'))
    .filter(Array.isArray);
}

export async function getUsers() {
  const result = await getIssues(2);
  return parseSecretToArr(result).map((o) => ({
    roleid: o[0],
    server: o[1],
  }));
}

export async function setIssues(content: string, number = 1) {
  return axios.patch(
    `https://api.github.com/repos/pinghuazhuang/z-cli/issues/${number}`,
    {
      title: dayjs().format('YYYY-MM-DD'),
      body: content,
    },
    {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `token ${token}`,
      },
    },
  );
}

export async function getIssues(number = 1) {
  const result = await axios.get(
    `https://api.github.com/repos/pinghuazhuang/z-cli/issues/${number}`,
    {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `token ${token}`,
      },
    },
  );
  return result.data.body;
}
