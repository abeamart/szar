const { TextInputBuilder, ModalBuilder, EmbedBuilder, ActionRowBuilder, TextInputStyle, ButtonStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const modalreason = new TextInputBuilder().setCustomId('helpcustommodal').setLabel("problem:").setStyle(TextInputStyle.Short).setRequired(true)
const modalrow = new ActionRowBuilder().addComponents(modalreason);
const modalhelp = new ModalBuilder().setCustomId('modalhelp').addComponents(modalrow).setTitle(`o co chcesz się spytać?`);

const helpembed = new EmbedBuilder().setColor('#5865F2')

module.exports = async (interaction, client, handler) => {

    if (interaction.customId == 'pomocdropdown') {
        const selectedhelp = interaction.values[0]
        if (selectedhelp == 'helpcustom') {

            console.log('br')
            await interaction.showModal(modalhelp)
        } else {
            await interaction.deferUpdate().then(async () => {


                if (selectedhelp == 'helpcommands') {

                    helpembed.setTitle('Komendy:')
                        .setFields({ name: 'nick', value: `pozwala zmienić twój przypisany nick. żeby wykorzystać wyświetlić i skonfigurować nazwę użytkownika nad twoimi wiadomościami użyj /ustaw-nazwę` },
                            { name: 'ustaw-nazwę', value: `pozwala konfigurować, jaka nazwa użytkownika wyświetla się nad twoimi wiadomościami, wybierz, które informacje mają się pokazywać, jeżeli jakiejś nie określisz, nie zmieni się jej stan` },
                            { name: 'zasady', value: `sprecyzuj zasadę, a ja wyślę wiadomość z tą zasadą na czacie` },
                            { name: 'nie pomogło?', value: `zawsze możesz skierować się do moderatora, albo do <@${interaction.guild.ownerId}>, gdyż jestem jeszcze nowy w te klocki :(` },
                        )

                    console.log(interaction.message)
                    interaction.editReply({ embeds: [helpembed], ephemeral: true })
                }
                else if (selectedhelp == 'helppersonalizacja') {

                    helpembed.setTitle('Personalizacja')
                        .setFields({ name: ' ', value: `personalizacja swojego profilu ułatwia komunikację na serwerze. łatwiej rozpoznać osoby i zachować czyste od nieporządanych osób środowisko.\n żeby personalizować swój profil nie trzeba podawać wszystkich danych, lecz jest to zalecane. potem można apelować o ich zmienienie.\nw każdej chwili możesz zmienić swój nick, gdyż może się często zmieniać (nie to co imię, czy nazwisko)\nwszystkie informacje podane w personalizacji zostaną usunięte przy wyjściu z serwera.` },
                            { name: 'nie pomogło?', value: `zawsze możesz skierować się do moderatora, albo do <@${interaction.guild.ownerId}>, gdyż jestem jeszcze nowy w te klocki :(` },
                        )

                    console.log(interaction.message)
                    interaction.editReply({ embeds: [helpembed] })
                }
                
            }).catch(error => console.log(error))
        }






    }

}