const Discord = require('discord.js');
var auth = require('./auth.json');
const client = new Discord.Client();
const logfile = "console.log";

client.on('ready', () => {
    // List servers the bot is connected to
    console.log("Servers:");
    client.guilds.forEach((guild) => {
        console.log(" - " + guild.name);
        // List all channels
        guild.channels.forEach((channel) => {
            console.log(` -- ${channel.name} (${channel.type}) - ${channel.id}`);
        });
    });
});
bot_secret_token = auth.token;

client.on('message', (receivedMessage) => {
    if (receivedMessage.author == client.user) {
        return;
    }

    if (receivedMessage.content.startsWith("/")) {
        parseCommand(receivedMessage);
    }
    else if (receivedMessage.content.startsWith("?")) {
        parseHelp(receivedMessage);
    }
});

function parseCommand(receivedMessage) {
    const fullMessage = receivedMessage.content.substr(1);
    const splitMessage = fullMessage.split(" ");
    const command = splitMessage[0];
    const params = splitMessage.slice(1);
    let reroll = false;

    console.log(`Command recieved: ${command}\nArguments: ${params}`);
    console.log(`Arg 0 type`, typeof(params[0]))
    console.log(`Arg 1 type`, typeof(params[1]))

    if(command == 'roll'){
        if (Number(params[0]) === NaN){
            receivedMessage.channel.send("Please only enter numbers for the number of d6s to roll.")
            return
        }
        if (params[1] !== 'false' && params[1] !== 'true' && params[1] !== '' && params[1] !== null && params[1] !== undefined){
            receivedMessage.channel.send('Please enter true, false, or nothing for the reroll feat die argument.')
            return
        }
        if(params[1] === 'true'){
            reroll = true
        }
        else if (params[1] === 'false') {
            reroll = false
        }
        receivedMessage.channel.send(rollDice(Number(params[0]),false, false, reroll));
    }
    else if (command == 'rollweary' || command == 'wearyroll') {
        if (Number(params[0]) === NaN) {
            receivedMessage.channel.send("Please only enter numbers for the number of d6s to roll.")
            return
        }
        if (params[1] !== 'false' && params[1] !== 'true' && params[1] !== '' && params[1] !== null && params[1] !== undefined) {
            receivedMessage.channel.send('Please enter true, false, or nothing for the reroll feat die argument.')
            return
        }
        if (params[1] === 'true') {
            reroll = true
        }
        else if (params[1] === 'false') {
            reroll = false
        }
        receivedMessage.channel.send(rollDice(Number(params[0]),false, true, reroll));
    }
    else if (command == 'evil') {
        if (Number(params[0]) === NaN) {
            receivedMessage.channel.send("Please only enter numbers for the number of d6s to roll.")
            return
        }
        if (params[1] !== 'false' && params[1] !== 'true' && params[1] !== '' && params[1] !== null && params[1] !== undefined) {
            receivedMessage.channel.send('Please enter true, false, or nothing for the reroll feat die argument.')
            return
        }
        if (params[1] === 'true') {
            reroll = true
        }
        else if (params[1] === 'false') {
            reroll = false
        }
        receivedMessage.channel.send(rollDice(Number(params[0]), true, false, reroll));
    }
    else if (command == 'evilweary' || command == 'gmwearyroll') {
        if (Number(params[0]) === NaN) {
            receivedMessage.channel.send("Please only enter numbers for the number of d6s to roll.")
            return
        }
        if (params[1] !== 'false' && params[1] !== 'true' && params[1] !== '' && params[1] !== null && params[1] !== undefined) {
            receivedMessage.channel.send('Please enter true, false, or nothing for the reroll feat die argument.')
            return
        }
        if (params[1] === 'true') {
            reroll = true
        }
        else if (params[1] === 'false') {
            reroll = false
        }
        receivedMessage.channel.send(rollDice(Number(params[0]), true, true, reroll));
    }
    else if (command === 'help' || command === '') {
        receivedMessage.channel.send('There are four supported commands for this bot, roll, rollweary, evil, and evilweary. Use ?<COMMAND> to learn more about a specific command. Use /<COMMAND> to use a specific command.')
    }
}

function parseHelp(receivedMessage){
    const fullMessage = receivedMessage.content.substr(1);
    const splitMessage = fullMessage.split(" ");
    const command = splitMessage[0];
    const params = splitMessage.slice(1);
    console.log('command: ', command)
    console.log('params: ', params)
    if(command === 'help' || command === ''){
        receivedMessage.channel.send('There are four supported commands for this bot, roll, rollweary, evil, and evilweary. Use ?<COMMAND> to learn more about a specific command. Use /<COMMAND> to use a specific command.')
    }
    else if(command == 'roll'){
        receivedMessage.channel.send('This will roll a normal skill check. The format is /roll <NUMBER OF DICE TO ROLL> <IF FEAT DIE IS REROLLED>. The feat die ')
    }
    else if (command == 'rollweary') {
        receivedMessage.channel.send('This will roll a weary skill check where 1s, 2s, and 3s are counted as 0. The format is /roll <NUMBER OF DICE TO ROLL> <IF FEAT DIE IS REROLLED>. The feat die ')
    }
    else if (command == 'evil') {
        receivedMessage.channel.send("This will roll an evil skill check where the feat die's crit and failure are reversed. The format is /roll <NUMBER OF DICE TO ROLL> <IF FEAT DIE IS REROLLED>. The feat die ")
    }
    else if (command == 'evilweary') {
        receivedMessage.channel.send("This will roll a weary evil skill check where the feat die's crit and failure are reversed and 1s, 2s, and 3s count as 0. The format is /roll <NUMBER OF DICE TO ROLL> <IF FEAT DIE IS REROLLED>. The feat die ")
    }
}

function rollDice(number, evil=false, weary=false, reroll=false){
    let d6Array = []
    let featDie = null
    for (let i = 0; i < number; i++){
        d6Array.push(Math.floor(Math.random() * 6) + 1)
    }
    if(!evil) featDie = rollFeatDie(reroll)
    else featDie = rollEvilDie(reroll)
    if(weary) d6Array = wearyd6(d6Array)
    return resolveRoll(d6Array, featDie);
}

function rollFeatDie(reroll=false){
    let d12 = Math.floor(Math.random() * 12) + 1;
    if (d12 == 11){
        d12 = 0;
    }
    if(reroll){
        newRoll = rollFeatDie();
        if(newRoll > d12){
            d12 = newRoll;
        }
    }
    return d12;
}

function rollEvilDie(reroll=false){
    let d12 = Math.floor(Math.random() * 12) + 1;
    // swaps 11 and 12 by knowing that autosucceed checks for either 11 or 12
    // so only need to remove 12
    if (d12 == 12) {
        d12 = 0;
    }
    if (reroll) {
        newRoll = rollEvilDie();
        if (newRoll > d12) {
            d12 = newRoll;
        }
    }
    return d12;
}

function countd6(d6Array){
    let countd6 = 0
    d6Array.forEach(e => {
        if (e == 6) countd6++;
    })
    return countd6
}

function wearyd6(d6Array){
    return d6Array.map(e => {
        if(e < 4) return 0
        return e
    })
}

function sumd6(d6Array){
    if (d6Array.length == 0)
        return 0
    return d6Array.reduce((a,b) => {
        return a + b;
    })
}

function resolveRoll(d6Array, featDie){
    let d6Count = countd6(d6Array)
    let success = "Normal"
    if(d6Count == 1){
        success = "Great"
    }
    else if(d6Count >= 2){
        success = 'Extraordinary'
    }
    const d6String = d6Array.join(', ')
    let retStr = ""
    if(featDie == 0){
        success += ` Catastrophe`
    }
    // if evildie, 11 is autosucceed instead
    else if (featDie == 11 || featDie == 12){
        success += ` Automatic`
    }
    retStr += `${featDie + sumd6(d6Array)} [<${featDie}> ${d6String}]\nSuccess Level: ${success}`

    return retStr
}

client.login(bot_secret_token);
