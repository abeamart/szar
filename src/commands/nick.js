require('dotenv').config();
const setnickname = require('../models/setnickname')
const dbdata = require('../models/dbdata')
const { SlashCommandBuilder } = require('discord.js');

module.exports = {

  data: new SlashCommandBuilder()
    .setName('nick')
    .setDescription('zmień swój nick!')
    .addStringOption(option =>
        option.setName('nowy-nick')
          .setDescription('wpisz pożądany nick')
          .setRequired(true)),

  run: async({ interaction, client, handler }) => {
    
    const newNick = interaction.options.getString('nowy-nick')
    let member = interaction.member
    
    await dbdata.findOneAndUpdate({ Id: member.id },
        { $set: { [`info.desirednick`]: newNick } })
    console.log(`${member} ustawił swój nick na "${newNick}"`)
    setnickname(interaction, member)
    interaction.reply('zmieniono twój nick ^_~')
  },
};
