const { Client, Intents, Collection, Permissions } = require("discord.js");

const { Logger } = require('simply-logger');
const { token, apiv, beta } = require("../config");
const ramapi = require('ram-api.js/extended');
const { create } = require("domain");

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_BANS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
        Intents.FLAGS.GUILD_WEBHOOKS,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_INVITES,
        Intents.FLAGS.GUILD_INTEGRATIONS,
        Intents.FLAGS.GUILD_MESSAGE_TYPING,
        Intents.FLAGS.GUILD_SCHEDULED_EVENTS,
    ],
    allowedMentions: {
        parse: ["users", "roles", "everyone"],
        repliedUser: true,
    },
    partials: ["MESSAGE", "REACTION", "GUILD_MEMBER", "CHANNEL", "USER"],
})

const logger = new Logger("Utils Bot", "America/New_York", 12, "./logs", true);

client.commands = new Collection();

client.on('ready', () => {
    logger.info("Ready!");


    ["command"].forEach((handler) => {
        require(`./Utils/${handler}`)(client);
    });

    ramapi.info.version_check(apiv);

    let devguild = client.guilds.cache.get("936050113602793483");

    let commands = client.application.commands;
    
    if(beta) commands = devguild.commands;


    commands?.create({
        name: 'hello',
        description: 'Get a hello'
    })
    
})

client.on("interactionCreate", (int) => {
    const { commandName, options } = int;
			let command = client.commands.get(commandName);
            if(!command) return;

            const permissions = new Permissions(command.perm);

            if(!int.member.permissions.has(permissions)) return int.reply(`Missing ${permissions.toArray()}`).catch(err => {});

            let extras = {
                ramapiversion: apiv
            }
            command.run(client, int, extras)
})

client.login(token)