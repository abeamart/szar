const { ButtonBuilder, ActionRowBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");
require('dotenv').config();

const cancel = new ButtonBuilder()
    .setCustomId('deletechancancel')
    .setLabel('anuluj')
    .setStyle(ButtonStyle.Primary)

const row = new ActionRowBuilder()
    .addComponents(cancel);



const deleteembed = new EmbedBuilder()
    .setColor('#5865F2')
    .setTitle('Zrobione!')
    .setDescription('ten kanał zostanie usunięty za 30 sekund')
let chanstodel = []

module.exports = async (interaction, client, handler) => {

    if (!interaction.isButton()) return;

    if (interaction.customId === 'deletechan') {

        if (await interaction.member.roles.cache.has(process.env.ADMIN_ROLE) == false) {//if user doesnt have permissions
            interaction.reply({ ephemeral: true, content: 'tylko moderator może to zrobić ;(' })
            console.log(`${interaction.member} próbował usunąć kanał, ale nie ma rangi moderatora`)
            return
        }

        await interaction.deferUpdate()
        chanstodel.push([interaction.message.id, setTimeout(() => { console.log('kanał został usunięty'); if (interaction.channel) { interaction.channel.delete() } }, 30000)])

        interaction.message.edit(
            {
                components: [row],
                embeds: [deleteembed]
            }
        )
        console.log(`kanał ${interaction.channel} będzie usunięty za 30 sekund`)
    }
    else if (interaction.customId === 'deletechancancel') {

        if (await interaction.member.roles.cache.has(process.env.ADMIN_ROLE) == false) {//if user doesnt have permissions
            interaction.reply({ ephemeral: true, content: 'tylko moderator może to zrobić ;(' })
            console.log(`${interaction.member} próbował usunąć kanał, ale nie ma rangi moderatora`)
            return
        }

        const timeout = chanstodel.findIndex(x => x[0] == interaction.message.id);

        if (timeout !== -1) {
            clearTimeout(chanstodel[timeout][1])
            const message = await interaction.channel.messages.fetch(chanstodel[timeout][0])
            message.delete()

            setTimeout(() => { interaction.reply({ ephemeral: true, content: 'anulowano!' }) }, 100)
            console.log(`anulowano usunięcie kanału przez ${interaction.member}`)
        }

    }
}