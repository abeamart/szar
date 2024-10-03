const { TextInputBuilder, ModalBuilder, EmbedBuilder, ActionRowBuilder, TextInputStyle, ButtonStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
require('dotenv').config();
const helpembed = new EmbedBuilder().setColor('#a85cc6')

module.exports = async (interaction, client, handler) => {

    if (interaction.customId === 'modalhelp') {
        const reason = interaction.fields.getTextInputValue('helpcustommodal')
        await interaction.guild.channels.fetch(process.env.MOD_CHAN)
            .then(modchan => {
                helpembed.setTitle(`potrzebuje pomocy!`)
                .setFields({name: 'o co chodzi:', value: reason})
                .setTimestamp()
                .setAuthor({name: interaction.user.username,iconURL: interaction.user.displayAvatarURL()})
                .setFooter({text: `ID: ${interaction.user.id}`})

                modchan.send({embeds: [helpembed]})
                interaction.reply({ephemeral: true, content: 'wysłano!'})
                
            })
            .catch(error => console.log(error))


    }


}