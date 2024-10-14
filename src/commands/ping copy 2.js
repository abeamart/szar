const { SlashCommandBuilder } = require('discord.js');

module.exports = {

  data: new SlashCommandBuilder()
    .setName('zmień-nick')
    .setDescription('pong!'),

  run: ({ interaction, client, handler }) => {
    
    interaction.reply(`pong! ${client.ws.ping}ms`);
  },
};
