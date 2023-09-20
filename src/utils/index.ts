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
