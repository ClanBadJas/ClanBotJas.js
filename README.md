# ClanBotJas.js (Deprecated, switched to Python)
> Notice: This Discord bot has been written to fulfill specific functions in our community. It was never intended and prepared for multi-server environments and/or scalable deployments. It's a bot designed to run on one specific server. You are free to use and/or copy this bot, but we can not provide support.

ClanBotJas Discord Bot, based on Discord.js version 12.4 is a simple, self-hosted, custom bot to implement automatic Voice Channel scaling and some basic command functions. It has been written to combat Voice Channel management and the neverending battle of always having either too much or not enough Voice Channels available for your Discord members. It also changes the name of a Voice Channel to the activity of connected users, automatically showing the topic of the Voice Channel.

## AutoScaler
The AutoScaler functionality of this bot keeps an eye on a specific Voice Channel Category in the Discord server and makes sure there is always an empty Voice Channel available to use. When a user joins an empty Voice Channel, the bot creates a new Voice Channel if other users want a seperate conversation. When users leave a Voice Channel, the extra Voice Channel will be removed automatically to get back to a single empty Voice Channel.

The AutoScaler settings can make use of higher Discord Server Boost Voice Quality settings, configured in the `config.json`.

![AutoScaler](https://github.com/ClanBadJas/ClanBotJas.js/blob/main/docs/screenshots/AutoScaler.png)


## AutoRename
On top of the above AutoScaler functionality, the bot is also built to reflect the activity which has the majority amongst the users in the Voice Channel. For example, if three users are in a Voice Channel and two of them are playing the game Factorio, the channel name will change to "Factorio". In a 50-50 situation, a random user activity will be selected.
When all users disconnect, the Voice Channel name will automatically be reset to the default name specified in the `config.json`.

![AutoRename](https://github.com/ClanBadJas/ClanBotJas.js/blob/main/docs/screenshots/AutoRename.png)


## Other Functions
The bot has a few basic commands which can be useful (functions and permissions can be set in the corresponding `<command>.js` file inside the `commands` folder).

`help` - Shows generic help or help for a specific command if specified as argument.

`load` - Loads a newly added module on the fly from the `commands` folder.

`ping` - Simple ping command to see if the bot is still alive and what the latency is.

`purge <1-99>` - purges X amount of messages from the current channel, maximum 99 at a time.

`reload` - Reloads .js command from the `commands` folder.

`say` - Makes the bot say your message and deletes the message with your command.


## Installation
For installation instructions please see the Discord.js documentation at [v12.discordjs.guide](https://v12.discordjs.guide) to prepare your environment with Node.js and create & add the bot to your server from the Discord Developer pages.

Clone this repository to the folder you want to run the bot from and use `npm run` while in the folder to start the bot and see if your environment is configured correctly.

Copy/rename `config.js-example` to `config.js` and edit your settings (to get ID's from your Discord server, enable `Developer mode` in your Discord client, then right click the object you want to copy the ID from and press `Copy ID` from the dropdown list).

In case your run (Debian) Linux like we do, make it start at boot as a service with the following systemd file:
```
[Unit]
Description=ClanBotJas Discord Bot

[Service]
ExecStart=/usr/bin/node /path/to/clanbotjas/index.js
Restart=always
WorkingDirectory=/path/to//clanbotjas

[Install]
WantedBy=multi-user.target
```
