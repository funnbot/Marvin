// bot creation
const Discord = require('discord.js');
const bot = new Discord.Client();
// config access
const config = require('./config.json');
// ALL THE MODULES
const cleverbot = require('cleverbot.io');
const clever = new cleverbot(config.clever.user, config.clever.key);
clever.setNick('Marvin');
clever.create(function (err, session) {
});
const sql = require('sqlite');
const fs = require('fs');
const leet = require('leet');
const Canvas = require('canvas');
const moment = require('moment');
const numtoword = require('number-to-words');
// command accesss
const eggs = require('./commands/eggs.js');
const coms1 = require('./commands/coms1.js');
const help = require('./commands/help.js');
const unused = require('./commands/unused.js');
const funcs = require('./funcs.js');
// main commands
const qr = require('./commands/main/quickreplies.js');
const bi = require('./commands/main/botinteractions.js');
const apis = require('./commands/main/apis/smallapis.js');
const ud = require('./commands/main/apis/ud.js');
const trump = require('./commands/main/apis/trump.js');
const calc = require('./commands/main/apis/calc.js');
const xkcd = require('./commands/main/apis/xkcd.js');
const other = require('./commands/main/other.js');
const profiles = require('./commands/main/profiles.js');
const levels = require('./commands/main/levels.js');
const guild = require('./commands/main/guilds.js');
const admin = require('./commands/main/admin.js');
const mc = require('./commands/main/apis/mc.js');

const colors = [0xf44242, 0xed6200, 0xed8e00, 0xede900, 0xa5ed00, 0x47ed00, 0x00ed7e, 0x00edc9, 0x00c5ed, 0x008eed, 0x004bed, 0x3f00ed, 0x8a00ed, 0xc100ed, 0xed00e1, 0xed0072];

sql.open('./media/main.sqlite');

function prefixesUpdate() {
	sql.all('SELECT * FROM guildOptions').then(rows => {
		for (let i = 0; i < rows.length; i++) {
			bot.prefixes[rows[i].guildId] = rows[i].prefix;
		}
	});
}

bot.on('ready', () => {
	bot.logLog = bot.channels.get('304441662724243457');
	console.log('Bot started.');
	funcs.games(bot);
	bot.prefixes = {};
	prefixesUpdate();
	setInterval(() => {
		prefixesUpdate();
	}, 15000);
});

bot.on('message', message => { // prefix problem :o
	if (!message.guild.me.permissions.has('SEND_MESSAGES')) return;
	if (message.author.bot) return;
	if (message.content.includes('<@' + bot.user.id + '>') && !message.content.startsWith('<@' + bot.user.id + '>') && message.author.id === '179114344863367169') return message.channel.send('Hello master.');
	let prefix = bot.prefixes[message.guild.id];
	if (prefix === undefined) prefix = '.';
	if (!message.content.startsWith(prefix) && !message.content.startsWith('<@' + bot.user.id + '>')) return;

	let command;
	if (message.content.startsWith(prefix)) command = message.content.split(' ')[0].slice(prefix.length);

	let args = message.content.split(' ').slice(1);

	if (message.content.startsWith('<@' + bot.user.id + '>')) {
		command = message.content.split(' ')[1];
		args = args.slice(1);
	}

	let suffix = args.join(' ');

	help.help(command, message, bot, suffix, colors);

	if (message.channel.type !== 'text') return;

	// easter eggs
	eggs.paasta(command, message);
	eggs.techno(command, message);
	eggs.gymno(command, message);
	eggs.fuckthis(command, message);
	eggs.nintenbot(command, message);
	eggs.foreveralone(command, message);
	// other commands
	qr.lenny(command, message);
	qr.marvin(command, message, bot);
	qr.L(command, message);
	qr.invite(command, message);
	bi.say(command, message, suffix);
	bi.joke(command, message, suffix, args);
	bi.dice(command, message, args, numtoword);
	apis.ball(command, message);
	apis.choose(command, message);
	apis.ss(command, message, args);
	apis.cleverbot(command, message, suffix, clever);
	apis.cat(command, message);
	apis.dog(command, message);
	ud.ud(command, message, suffix);
	trump.trump(command, message, suffix);
	calc.calc(command, message, suffix, bot);
	xkcd.xkcd(command, message, bot, args);
	mc.mc(command, message, args, suffix, Discord);
	other.leet(command, message, leet, args, suffix);
	other.eval(command, message, suffix, bot, Discord, sql, config);
	guild.guild(command, message, args, suffix, sql);
	levels.xp(command, message, sql, args, suffix, Discord, colors, bot, config);
	levels.xpinfo(command, message, config, colors);
	levels.leaderboard(command, message, args, sql, bot);
	admin.kys(command, message);
	admin.listServers(command, message, bot);
	admin.serverInfo(command, message, bot, args, moment);
	admin.sendMessage(command, message, bot, args, suffix);
	admin.logger(command, message, bot, args);
	admin.userInfo(command, message, bot, args, moment);
	profiles.profiles(command, message, args, suffix, sql, Discord, Canvas, fs);
});
// other stuffs with message event
bot.on('message', message => {
	funcs.instadelete(bot, message);
	funcs.logger(bot, message, moment);
	funcs.levels(bot, message, sql, config);
});

// send to console
bot.on('error', (e) => console.error(e));
bot.on('warn', (e) => console.warn(e));
bot.on('debug', (e) => console.info(e));

process.on('unhandledRejection', err => {
	console.error('Uncaught Promise Error: \n' + err.stack);
});

bot.login(config.token);
