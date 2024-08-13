'use strict';

var inquirer = require('inquirer');
var axios = require('axios');
var CliTable = require('cli-table3');
require('dayjs');

const token = process.env.TOKEN;
function sleep(delay) {
    return new Promise(resolve => setTimeout(resolve, delay));
}
/**
 * 解析 secret 为数组
 * @example name:msg,name2:msg2 => [[name, msg], [name2, msg2]]
 */
function parseSecretToArr(secret) {
    return secret
        .split(',')
        .map((o) => o?.trim().split(':'))
        .filter(Array.isArray);
}
async function getUsers() {
    const result = await getIssues(2);
    return parseSecretToArr(result).map((o) => ({
        roleid: o[0],
        server: o[1],
    }));
}
async function getIssues(number = 1) {
    const result = await axios.get(`https://api.github.com/repos/pinghuazhuang/z-cli/issues/${number}`, {
        headers: {
            Accept: 'application/vnd.github+json',
            Authorization: `token ${token}`,
        },
    });
    return result.data.body || '';
}

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
async function enterUserInfo(userInfo, code) {
    return axios
        .post(`https://activity.zlongame.com/activity/cmn/card/csmweb.do`, {
        appkey: '1486458782785',
        card_user: userInfo.roleid,
        card_channel: '0123456789',
        card_server: userInfo.server,
        card_role: userInfo.roleid,
        card_code: code,
        type: '2',
    }, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            Referer: 'https://www.zlongame.com/',
        },
    })
        .then((res) => res.data);
}
async function exchange(code) {
    const users = await getUsers();
    const result = await Promise.allSettled(users.map(async (o) => {
        await sleep(500);
        return await enterUserInfo(o, code);
    }));
    const table = new CliTable({
        style: {
            head: ['green'],
        },
    });
    table.push(['roleid', 'result', 'message']);
    result.forEach((o, index) => {
        const infoCode = o.status === 'fulfilled' ? String(o.value.info) : 'error';
        const roleid = users[index].roleid;
        const roleidChunk = roleid.slice(roleid.length - 4, roleid.length);
        table.push([
            roleidChunk,
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

function index () {
    return inquirer
        .prompt([
        {
            type: 'input',
            name: 'code',
            message: '请输入礼拜码:',
        },
    ])
        .then(async ({ code }) => {
        return exchange(code);
    });
}

exports.mh = index;
