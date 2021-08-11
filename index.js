// - CBJ  AutoScaler Discord Bot -
// index.js main bot function file
// version: 1.0
// -------------------------------

// Link file services
const fs = require('fs');

// Link discord.js library.
const Discord = require("discord.js");

// Link the config.json file.
// Use config.<setting> to use, example config.TOKEN
const config = require("./config.json");

// Calculate averages
function mode(arr) {
    return arr.sort((a, b) => arr.filter((v) => v === a).length
        - arr.filter((v) => v === b).length
    ).pop();
}

// Link bot client.
const client = new Discord.Client();

// Automatic command loading from the commands folder
// Set up a new collection to load commands into
client.commands = new Discord.Collection();

// Point to commands folder and make sure only .js files are loaded
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
// Load all command files
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}


// Run start-up commands when bot is logged on.
client.once("ready", () => {
	// This event will run if the bot starts, and logs in, successfully.
	console.log(`${config.BOT_NAME} has started, serving ${client.users.cache.size} users, in ${client.channels.cache.size} channels on ${client.guilds.cache.size} server(s).`); 
	// Set the bot's playing game
	client.user.setActivity(config.BOT_ACTIVITY);
});


// Send a message when the bot is added to a server.
client.on("guildCreate", guild => {
    console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members.`);
    const logging = client.channels.cache.get(config.LOGCHANNEL);
    logging.send(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members.`);
});


// Send a message when the bot is deleted from a server.
client.on("guildDelete", guild => {
    console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
    const logging = client.channels.cache.get(config.LOGCHANNEL);
    logging.send(`I have been removed from: ${guild.name} (id: ${guild.id})`);
});


// Dynamic message command handling
client.on('message', async message => {
    // Validate if prefix is present or if message comes from a bot, if not, stop.
	if (!message.content.startsWith(config.PREFIX) || message.author.bot) return;

    // Remove prefix and convert to lower case
	const args = message.content.slice(config.PREFIX.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();
    
    // Search for the command and possible aliases and stop if it doesn't exist
    const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    
    if (!command) return;

    // If command is valid, log to console
    console.log(
        (message.channel.type === 'text'
          ? `${message.guild.name} #${message.channel.name} | `
          : '') + `${message.author.tag}: ${message.content}`
    );
    // And log to channel
    const logging = client.channels.cache.get(config.LOGCHANNEL);
    logging.send(
        (message.channel.type === 'text'
          ? `:arrow_forward: Command:		#${message.channel.name} | `
          : '') + `${message.author.tag}: ${message.content}`
    );

    // Stop an invalid DM command.
    if (command.guildOnly && message.channel.type === 'dm') {
		return message.reply('I can\'t execute that command inside DMs.');
    }

    // If required, check admin permission on DM
    if (message.channel.type === 'dm') {
        if (command.adminDM && !config.GLOBAL_ADMINS.includes(message.author.tag)) {
            return message.reply('You do not have permissions to use that command.');
        }
    }
    // If no DM and if required, check permissions with guild roles
    else {
        if (command.admin && !message.member.roles.cache.some(role => role.name === config.ADMIN_ROLE) ||
             command.mod && !message.member.roles.cache.some(r => [config.MOD_ROLE, config.ADMIN_ROLE].includes(r.name)) ||
              command.user && !message.member.roles.cache.some(r => [config.USER_ROLE, config.MOD_ROLE, config.ADMIN_ROLE].includes(r.name))) {
            return message.reply('You do not have permissions to use that command.');
        }
    }
    // Check if arguments were used when required by command
    if (command.args && !args.length) {
		let reply = `Please provide arguments, ${message.author}.`;

		if (command.usage) {
			reply += `\nExpecting: \`${config.PREFIX}${command.name} ${command.usage}\``;
		}

		return message.channel.send(reply);
    }

	try {
		command.run(message, args);
	} catch (error) {
		console.error(error);
		message.reply('Error/Unknown command!');
	}
});



// Run Auto Channel Scaler functions when bot logs on.
client.on("voiceStateUpdate", async (oldState, newState) => {
		
	// Load all voice channels in configured category.
       const vChannels = client.channels.cache.filter(channel => channel.parent &&	channel.parent.id === config.GAMES_CATEGORY_ID && channel.type === 'voice')
        
	// Load all empty voice channels.
       const vChannelsEmpty = vChannels.filter(channel => channel.members.size === 0)
        
	// When there's no available, empty, channel, create a new one.
	if (vChannelsEmpty.size === 0) {
			
		// Make sure we send requests to the right guild.
		const setGuild = client.guilds.cache.get(config.GUILD_ID)
			
		// Create the channel directly within the correct category.
        setGuild.channels.create(config.CHANNEL_NAME, { type : 'voice', bitrate : config.VOICE_BITRATE, parent : config.GAMES_CATEGORY_ID })
            .catch(console.error);
			
		// Send message to console
        console.log(`${config.BOT_NAME} => AutoScale:	New channel created.`);

        // And log to channel
        const vChannelsManaged = vChannels.array().length +1;
        const logging = client.channels.cache.get(config.LOGCHANNEL);
        logging.send(`:arrows_clockwise: AutoScale:		New channel created. Now managing ${vChannelsManaged} channels.`);
    }
        
	// Check if there is more than one empty channel.
	if (
		vChannelsEmpty.array().length > 1 &&
		vChannels.array().length > 1
	) {
		// Get the last empty channel and delete it.
		if (vChannelsEmpty.last()) {
			vChannelsEmpty.last().delete()
                   .catch(console.error);
                
			// Once again, send a message to console.
            console.log(`${config.BOT_NAME} => AutoScale:	Empty channel removed.`);
                
            // And log to channel
            const vChannelsManaged = vChannels.array().length -1;
            const logging = client.channels.cache.get(config.LOGCHANNEL);
            logging.send(`:arrows_clockwise: AutoScale:		Empty channel removed. Now managing ${vChannelsManaged} channel(s).`);
			} 
    }
});

// Change voice channel name based on the activity that's in'the majority.
client.on("presenceUpdate", async (oldPresence, newPresence) => {

    const channelList = client.channels.cache.filter(channel => channel.parent && channel.parent.id === config.GAMES_CATEGORY_ID && channel.type === 'voice')
    channelList.map(channel => {
		let gameList = []
        const channelMembers = channel.members.array();

		channel.members.map(member => {
			if (member.presence.activities) gameList.push(member.presence.activities); console.log(member.presence.activities);
        })

		if (gameList.length >= 1) {
			const presences = channelMembers.filter((m) => m.presence.activities && m.presence.activities.find(activity => activity.type === 'PLAYING'))
            .map((m) => m.presence.activities[0].name);

			if (presences.length > 0) {
				const modalGame = mode(presences);
                const channelName = modalGame;

				if (channelName == channel.name) {
				}
				else {
					channel.setName(channelName);
                    console.log(`${config.BOT_NAME} => AutoRename:	Changed ${channel.name} to ${channelName}.`);
                    // And log to channel
                    const logging = client.channels.cache.get(config.LOGCHANNEL);
                    logging.send(`:twisted_rightwards_arrows: AutoRename:	Changed ${channel.name} to ${channelName}.`);
				}
			}
		}
    })

    // See if there are any empty channels that need to be renamed to default.
    const vChannels = client.channels.cache.filter(
        channel =>
            channel.parent &&
            channel.parent.id === config.GAMES_CATEGORY_ID &&
            channel.type === 'voice'
    )
  
    const vChannelsEmpty = vChannels.filter(
        channel => channel.members.size === 0
    )
  
    vChannelsEmpty.map (channel => {
        if (vChannelsEmpty.size > 0) {
            if (config.CHANNEL_NAME == channel.name) {
            }
            else {
                channel.setName(config.CHANNEL_NAME)
                .catch(err => console.log(`${config.BOT_NAME} => AutoRename:	${channel.name} already removed.`))
                console.log(`${config.BOT_NAME} => AutoRename:	Changed ${channel.name} to ${config.CHANNEL_NAME}.`);
                // And log to channel
                const logging = client.channels.cache.get(config.LOGCHANNEL);
                logging.send(`:twisted_rightwards_arrows: AutoRename:	Changed ${channel.name} to ${config.CHANNEL_NAME}.`);
            }
        }
    })
});

client.login(config.TOKEN);