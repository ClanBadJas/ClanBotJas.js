const config = require("../config.json");

module.exports = {
	name: 'help',
	description: 'List all of my commands or info about a specific command.',
	aliases: ['commands'],
	usage: '[command name]',
	args: false,
    admin: false,
    mod: false,
    user: false,
    guildOnly: false,
    adminDM: false,
	run: async (message, args) => {
		const data = [];
		const { commands } = message.client;

		if (!args.length) {
			data.push('These are all my commands:');
			data.push(commands.map(command => command.name).join(', '));
			data.push(`\nYou can send \`${config.PREFIX}help [command name]\` to get info on a specific command.`);

			return message.author.send(data, { split: true })
				.then(() => {
					if (message.channel.type === 'dm') return;
					message.reply('I\'ve sent you a DM with all my commands.');
				})
				.catch(error => {
					console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
					message.reply('It seems like I can\'t DM you...');
				});
		}

		const name = args[0].toLowerCase();
		const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

		if (!command) {
			return message.reply('that\'s not a valid command!');
		}

		data.push(`**Name**: ${command.name}`);

		if (command.aliases) data.push(`**Aliases**: ${command.aliases.join(', ')}`);
		if (command.description) data.push(`**Description**: ${command.description}`);
		if (command.usage) data.push(`**Usage**: ${config.PREFIX}${command.name} ${command.usage}`);

		message.channel.send(data, { split: true });
	},
};