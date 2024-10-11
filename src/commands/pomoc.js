const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
require('dotenv').config();


const helpembed = new EmbedBuilder().setColor('#5865F2').setTitle('Pomoc!')

const select = new StringSelectMenuBuilder()

  .setCustomId('pomocdropdown')
  .setPlaceholder('wybierz, z czym potrzebujesz pomocy!')
  
  .addOptions(
    new StringSelectMenuOptionBuilder()
      .setLabel('z personalizacją?')
      .setDescription('wszystko, co musisz wiedzieć o personalizacji profilu')
      .setValue('helppersonalizacja'),
    new StringSelectMenuOptionBuilder()
      .setLabel('z komendami?')
      .setDescription('wszystkie komendy i wszystko co musisz o nich wiedzieć')
      .setValue('helpcommands'),
    new StringSelectMenuOptionBuilder()
      .setLabel('z czymś innym?')
      .setDescription('nie widzisz problemu, który posiadasz? wybierz tą opcję')
      .setValue('helpcustom'))
      
module.exports = {

  data: new SlashCommandBuilder()
    .setName('pomoc')
    .setDescription('pomoc!'),

  run: async ({ interaction, client, handler }) => {
  await interaction.deferReply()
const row3 = new ActionRowBuilder().addComponents(select);

    if (Math.floor(Math.random() * 101) == 1) {
      helpembed.setDescription(`w czym mogę slużyć ${interaction.member}?`)
    } else {
      helpembed.setDescription(`z czym potrzebujesz pomocy ${interaction.member}?`)
    }
    interaction.editReply({ ephemeral: true, components: [row3], embeds: [helpembed] }) 


  },
};
