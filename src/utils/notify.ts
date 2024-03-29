import axios from 'axios';

/**
 * 通过server酱推送消息
 * https://sct.ftqq.com
 * @param msgTile 消息标题, 不支持内容
 */
export function notifyWithSct(msgTile: string) {
  return axios.get(
    `https://sctapi.ftqq.com/${process.env.SEND_KEY}.send?title=${msgTile}&channel=9`,
  );
}

/**
 * 通过 Bark 来推送消息到手机
 * https://github.com/finb/bark
 */
export function notifyWithBark(
  title: string,
  content: string,
  group = 'zlgame',
  icon = 'https://mz.zlongame.com/img/icon/h131.png',
) {
  return axios.get(
    `https://api.day.app/${process.env.BARK_KEY}/${encodeURIComponent(
      title,
    )}/${encodeURIComponent(content)}?group=${group}&icon=${encodeURIComponent(
      icon,
    )}`,
  );
}
