'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var inquirer = _interopDefault(require('inquirer'));
var axios = _interopDefault(require('axios'));
var CliTable = _interopDefault(require('cli-table'));

const users = [
    {
        roleid: '3391682085992409183',
        server: '6023',
    },
    {
        roleid: '3410269554617355795',
        server: '6057',
    },
];
async function enterUserInfo(userInfo, code) {
    return axios.post(`https://activity.zlongame.com/activity/cmn/card/csmweb.do`, {
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
    }).then((res) => res.data);
}
async function exchange(code) {
    for (const [k, v] of Object.entries(users)) {
        await enterUserInfo(v, code);
    }
    const result = await Promise.allSettled(users.map(async (o) => await enterUserInfo(o, code)));
    const table = new CliTable({
        // head: new Array(2),
        style: {
            head: ['green'],
        },
    });
    result.forEach((o, index) => {
        table.push([users[index].roleid, o.status === 'fulfilled' && o.value.status === '200' ? '✔' : '❌']);
    });
    console.log(table.toString());
    process.exit();
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
