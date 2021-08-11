module.exports = {
    name: 'purge',
    aliases: ['del', 'delete'],
    description: 'Using say removes your command and replaces it with your message sent by the bot.',
    usage: '<2-100>',
    args: true,
    admin: true,
    mod: false,
    user: false,
    guildOnly: true,
    adminDM: false,
	run: async (message, args) => {
        // get the delete count, as an actual number.
        const deleteCount = parseInt(args[0], 10);
    
        // Check if the number is correct
        if(!deleteCount || deleteCount < 2 || deleteCount > 100)
        return message.reply("Please provide a number between 2 and 100.");

        // So we get our messages, and delete them. Simple enough, right?
        const fetched = await message.channel.messages.fetch({limit: deleteCount});
        message.channel.bulkDelete(fetched)
          .catch(error => message.reply(`Couldn't delete messages because of: ${error}`)); 
    },
};