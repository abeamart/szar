const { SlashCommandBuilder } = require('discord.js');

module.exports = {

  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('pong!'),

  run: async({ interaction, client, handler }) => {
    
    interaction.reply(`pong! ${client.ws.ping}ms`);
    const cat = await interaction.guild.channels.fetch('1160312867724202126')
    cat.clone()
  },
};
