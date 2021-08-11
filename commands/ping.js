module.exports = {
    name: 'ping',
    aliases: ['p', 'pong'],
    description: 'Ping returns the latency in milliseconds of the bot.',
    usage: '',
    args: false,
    admin: true,
    mod: true,
    user: false,
    guildOnly: false,
    adminDM: true,
	run: async (message, args) => {
		const msg = await message.channel.send("Ping?");
        msg.edit(`Pong! Latency is ${msg.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(message.client.ws.ping)}ms`);
	},
};