const { TextInputBuilder, ModalBuilder, EmbedBuilder, ActionRowBuilder, TextInputStyle, ButtonStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
require('dotenv').config();
const helpembed = new EmbedBuilder().setColor('#a85cc6')

module.exports = async (interaction, client, handler) => {

    if (interaction.customId === 'modalhelp') {
        await interaction.deferReply({ ephemeral: true }).then(async () => {
            const reason = interaction.fields.getTextInputValue('helpcustommodal')
            const modchan = await interaction.guild.channels.fetch(process.env.MOD_CHAN)

            helpembed.setTitle(`potrzebuje pomocy!`)
                .setFields({ name: 'o co chodzi:', value: reason })
                .setTimestamp()
                .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
                .setFooter({ text: `ID: ${interaction.user.id}` })

            modchan.send({ embeds: [helpembed] })
            interaction.editReply({ content: 'wysłano!' })

        }).catch(error => console.log(error))

    }


}