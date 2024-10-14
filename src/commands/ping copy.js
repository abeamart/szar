const { SlashCommandBuilder } = require('discord.js');

module.exports = {

  data: new SlashCommandBuilder()
    .setName('mod')
    .setDescription('pong!'),

  run: ({ interaction, client, handler }) => {
    
    interaction.reply(`pong! ${client.ws.ping}ms`);
  },
};
