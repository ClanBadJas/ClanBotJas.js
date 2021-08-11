module.exports = {
    name: 'say',
    description: 'Using say removes your command and replaces it with your message sent by the bot.',
    usage: '<message>',
    args: true,
    admin: true,
    mod: true,
    user: false,
    guildOnly: true,
    adminDM: false,
	run: async (message, args) => {
        const msg = args.join(" ");
        message.delete().catch(Messageerror=>{});
        message.channel.send(msg);
	},
};