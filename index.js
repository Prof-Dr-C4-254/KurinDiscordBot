// Require the necessary discord.js classes
const { Client,Collection,Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}
// When the client is ready, run this code (only once)

const loadEvents = (dir) => {
    const files = fs.readdirSync(dir);
  
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
  
      if (stat.isDirectory()) {
        loadEvents(filePath, client); // Recurse into subdirectory
      } else if (file.endsWith(".js")) {
        const event = require(filePath);

  
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
        } else {
          client.on(event.name, (...args) => event.execute(...args));
        }
      }
    }
  };
  
  
  
  
  const eventsPath = path.join(__dirname, "events");
  loadEvents(eventsPath);



// We use 'c' for the event parameter to keep it separate from the already defined 'client'


// Log in to Discord with your client's token
client.login(token);