const dbdata = require('../../../models/dbdata')
const canfetch = require('../../../models/canfetch')
const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
require('dotenv').config();

const changedata = new ButtonBuilder().setCustomId('verifymodaltrigger').setLabel('zmień ustawienia profilu').setStyle(ButtonStyle.Primary)
const approve = new ButtonBuilder().setCustomId('approveverprof').setLabel('zatwierdź profil').setStyle(ButtonStyle.Success)
const deny = new ButtonBuilder().setCustomId('denyverprof').setLabel('zakończ niepomyślnie').setStyle(ButtonStyle.Danger)

const exampleEmbed = new EmbedBuilder().setColor('#DA373C').setTitle('Podanie odrzucone :(').setFooter({ text: 'spróbuj ponownie pózniej!' }).setTimestamp()

const row = new ActionRowBuilder().addComponents(approve, deny, changedata);
const grading1 = ['1', '2', '3', '4']
const grading2 = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']

module.exports = async (interaction, client, handler) => {
    if (!interaction.isModalSubmit()) return;
    if (interaction.customId === 'vermodalmain') {
        await interaction.deferUpdate().then(async () => {
            const memnick = await canfetch(interaction.guild.members, interaction.channel.topic)

            if (memnick == false) { interaction.editReply('nie znaleziono użytkownika..'); return }

            const userdb = await dbdata.findOne({ Id: interaction.channel.topic })

            let answerfields = [
                [interaction.fields.getTextInputValue('vermodalname'), "imię"],
                [interaction.fields.getTextInputValue('vermodalnick'), "nick"],
                [interaction.fields.getTextInputValue('vermodalsurname'), "nazwisko"],
                [interaction.fields.getTextInputValue('vermodalgrade'), "klasa"]
            ]
            if (answerfields[3][0]) {
                if (!grading1.includes(answerfields[3][0][0]) || !grading2.includes(answerfields[3][0][1].toUpperCase())) {

                    interaction.channel.send(`${interaction.member} klasa musi być złożona z cyfry, a następnie litery i być istniejącą klasą w Norwidzie (na przykład: 1A, 4G, 3F), a nie "${answerfields[3][0]}"`)

                    answerfields[3][0] = userdb.info.unverdesiredinfo.grade

                } else {
                    answerfields[3][0] = answerfields[3][0].toUpperCase()
                }
            }

            await userdb.updateOne({
                'info.unverdesiredinfo.name': answerfields[0][0],
                'info.unverdesiredinfo.desirednick': answerfields[1][0],
                'info.unverdesiredinfo.surname': answerfields[2][0],
                'info.unverdesiredinfo.grade': answerfields[3][0]
            })
            let updatedstrings = ''
            answerfields.forEach(el => { if (el[0] !== '') updatedstrings += (`${el[1]}: " ${el[0]} "\n`) })

            const msgembed = interaction.message.embeds[0]

            if (msgembed.fields.length > 1) {
                const beterembed = new EmbedBuilder()
                    .setColor(msgembed.color)
                    .setDescription(interaction.message.embeds[0].description)
                    .addFields(
                        { name: ' ', value: msgembed.fields[0].value },
                        { name: msgembed.fields[1].name, value: msgembed.fields[1].value },
                        { name: `nowe informacje dla ${memnick.user.username}:`, value: updatedstrings })

                interaction.message.edit({
                    embeds: [beterembed],
                    components: [row]
                })
                
                console.log(`informacje z modalu zostały pomyślnie wysłane`)
            }
            else {
                interaction.editReply('coś poważnego poszło nie tak... :<')
                console.log(`coś stało się z załącznikiem personalizacji profilu.. możliwie, że została usunięta`)
            }
        }).catch(error => console.log(error))






    } else if (interaction.customId === 'modalkickreason') {
        //inform him in dms and kick
        await interaction.deferUpdate().then(async () => {
            const mem = await canfetch(interaction.guild.members, interaction.channel.topic)

            if (mem == false) {
                interaction.guild.channels.delete(interaction.channel); return
            }
            const reason = interaction.fields.getTextInputValue('vermodalname')
            if (reason) {
                exampleEmbed.setFields({ name: ' ', value: `niestety odrzucono twoje podanie personazalicji profilu.` }, { name: 'podany powód:', value: reason })

                mem.send({ embeds: [exampleEmbed] }).catch(error => console.log(error))
            } else {
                exampleEmbed.setFields({ name: ' ', value: `niestety odrzucono twoje podanie personazalicji profilu bez podanego powodu.` })

                mem.send({ embeds: [exampleEmbed] }).catch(error => console.log(error))
            }

            if (await mem.roles.cache.has(process.env.ADMIN_ROLE) == false && await mem.roles.cache.has(process.env.MEMBER_ROLE) == false) {
                mem.kick('nie udało się przejść procesu personalizacji').then(mem => console.log(`wyrzucono ${mem}`)).catch(error => console.log(error));
            }
            console.log(`powiodło się niepomyślne zakończnie personalizacji użytkownika ${mem}`)
            interaction.guild.channels.delete(interaction.channel)
        }).catch(error => console.log(error))


    }

}