module.exports = {
	name: 'load',
	description: 'Loads a new command',
    usage: '<command>',
	args: true,
    admin: true,
    mod: false,
    user: false,
    guildOnly: false,
    adminDM: true,
	run: async (message, args) => {
		const commandName = args[0].toLowerCase();
		const command = message.client.commands.get(commandName)
			|| message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

		if (command) {
			return message.channel.send(`Command \`${commandName}\`, is already loaded.`);
		}

		try {
			const newCommand = require(`./${commandName}.js`);
			message.client.commands.set(newCommand.name, newCommand);
			message.channel.send(`Command \`${commandName}\` was loaded!`);
		} catch (error) {
			console.error(error);
			message.channel.send(`There was an error while loading a command \`${command.name}\`:\n\`${error.message}\``);
		}
	},
};