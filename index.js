//Discord.js library
const Discord = require("discord.js");

//Dotenv library
require('dotenv').config();

//Discord music player library
const { Player }  = require("discord-music-player");

//Core commands library
const Core = require('./core');
var core = new Core();

//Space commands library
const Space = require('./space');
var space = new Space();

//Music commands library
const Music = require('./music');
var music = new Music();

//Get setting variables
const token = process.env.TOKEN;
const server = process.env.SERVER;
const prefix = process.env.PREFIX;
const name = process.env.NAME;
const pfp = process.env.PFP;
const color = process.env.COLOR;
const url = process.env.URL;
const parentId = process.env.PARENTID;

//New discord client instance
const client = new Discord.Client();

//Define music player settings
const player = new Player(client, {
    leaveOnEnd: true,
    leaveOnStop: true,
    leaveOnEmpty: true,
    timeout: 0,
    volume: 100,
    quality: 'high',
});

//Set player as music player
client.player = player;

//When client logs successfully in
client.once("ready", () => {
    //Set the game based on how many servers the bot is in
    client.user.setPresence({
        status: 'online',
        activity: {
            name: "in " + client.guilds.cache.size + " servers | " + url,
            type: "PLAYING",
        }
    })

    //Discord / commands to help people
    client.api.applications(client.user.id).commands.post({data: {
        name: name+'Help',
        description: 'Get help and commands for ' + name + ' bot.'
    }})

    //Show debug information in the console for turn on
    console.log("Build Successful");
    console.log("=========================");
    console.log("Configured variables:");
    console.log("=========================");
    console.log("server: " + server);
    console.log("server_count: " + client.guilds.cache.size);
    console.log("prefix: " + prefix);
    console.log("name: " + name);
    console.log("pfp: " + pfp);
    console.log("color: " + color);
    console.log("url: " + url);
    console.log("=========================");
    console.log("Waiting for commands:");
    console.log("=========================");
});

client.player.on('playlistAdd',  (message, queue, playlist) => 
        message.channel.send(`${playlist.name} playlist with ${playlist.videoCount} songs has been added to the queue!`));

client.on("message", message => {
    //If message is not meant for us, ignore it
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    //Work out the command that was sent
    const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();

    //Debug things
    console.log("command recieved: " + command + " " + args);

    switch(command) {
        case "say":
            //Play song: play [name/url]
            message.channel.send(args);
            break;
        case "play":
            //Play song: play [name/url]
            music.play(message, args, player, Discord, server, prefix);
            break;
        case "playlist":
            //Play playlist: playlist [name/url]
            music.playlist(message, args, player, Discord, server, prefix);
            break;
        case "skip":
            //Skips the current song: skip
            music.skip(message, player);
            break;
        case "clear":
            //Clears the queue and leaves: clear
            music.clear(message, player);
            break;
        case "shuffle":
            //Shuffles the queue: shuffle
            music.shuffle(message, player);
            break;
        case "q":
            //Shows the queue to the user: q
            music.queue(message, player);
            break;
        case "queue":
            //Shows the queue to the user: queue
            music.queue(message, player);
            break;
        case "loop":
            //Loops the current song: loop
            music.loop(message, player);
            break;
        case "pause":
            //Pauses the current song: pause
            music.pause(message, player);
            break;
        case "resume":
            //Resumes the current song: resume
            music.resume(message, player);
            break;
        case "progress":
            //Shows a progress bar for the current song: progress
            music.progress(message, player);
            break;
        case "rover":
            //Shows a mars rover picture: rover
            space.rover(message, Discord, args);
            break;
        case "help":
            //Shows a help embed for new users: help
            core.help(message, Discord);
            break;
        case "bytetest":
            music.byteplTest(message, Discord, args, player);
            break;
        case "debug":
            //Shows all the debug info for the sever
            core.debug(message, Discord, client);
            break;
        default:
            //Shows an error message
            core.unknown(message, Discord, command);
            break;
        }
    });

// On voice state canged
client.on('voiceStateUpdate', (oldMember, newMember) => {
    // If parent bot is present, do nothing
    if(parentId != "null") {
        if(newMember.guild.members.fetch(parentId)) {
            console.log("Handled by parent bot: " + parentId)
            return;
        }
    }

    let newUserChannel = newMember.channelID;
    let oldUserChannel = oldMember.channelID;
        
    console.log(newUserChannel);
    if(oldUserChannel == undefined && newUserChannel != undefined && newMember.member.user.bot != true) {
    
        // User Joins a voice channel
        const channel = newMember.guild.channels.cache.find(channel => channel.name === "vcupdates");
    
        let guild = newMember.guild;
        let member = guild.member(newMember.member.user);
        let nickname = member ? member.displayName : null;
    
        const exampleEmbed = new Discord.MessageEmbed()
            .setColor(color)
            .setTitle(nickname + ' just joined ' + newMember.channel.name)
            .setAuthor(nickname, newMember.member.user.displayAvatarURL())
            .setTimestamp();
    
        channel.send(exampleEmbed);
       
    } else if(newUserChannel === undefined && oldUserChannel != undefined){
       
        // User leaves a voice channel
       
    }
})

//Log the bot in with the token provided
client.login(token); 