const checkforverchannel = require('../../../models/checkforverchannel')
const createverchan = require('../../../models/createverchan')
const { userMention, PermissionsBitField, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");
require('dotenv').config();

const veroptions = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('verkontynuuj').setLabel('kontynuuj starą sesję').setStyle(ButtonStyle.Success),
    new ButtonBuilder().setCustomId('verodnowa').setLabel('od nowa').setStyle(ButtonStyle.Primary));

let debounce = false

module.exports = async (interaction, client, handler) => {

    if (!interaction.isButton()) return;

    if (interaction.customId === 'powody') {
        interaction.reply({ ephemeral: true, content: `zaczynając, twoje dane są tylko dla uczestników serwera. nie jestem chińskim szpiegiem i nie kolekcjonuję danych. jeżeli chcesz usunąć informację o sobie możesz po prostu wyjść z serwera. pamiętaj, że twój lvl dalej będzie zapisany nawet po wyjściu  \n\nno więc, ${userMention(interaction.user.id)}, używanie takiego systemu na serwerze tematycznym takie jak to, jest niepozornie wielkim game-changer'em w komunikacji. podam parę powodów. /^o^/ \n\n1. znaczy to koniec z zapominaniem nick-ów kolegów, którzy notorycznie je zmieniają. \n2. zunifikowany serwer, jak ten umożliwia też łatwiejszy dostęp do rówieśników, do których między innymi, na przykład: masz pytanie. \n3. ten system ułatwia też moderowanie serwera i zapobiega raid'om (czyli masowym przypływie najczęściej toksycznych członków spoza szkoły, których zamiary daleko wychodzą poza chęć integracji). \n4. poprzedni serwer miał także problem udostępniania nieprzyzwoitych treści na kanałach głównych. mam nadzieje, że z imieniem i nazwiskiem nad avatar'ami, zlikwiduje zwodniczego uczucie bezkarności i anonimowości.\n5. finalny i najważniejszy powód to oczywiście łatwiejsza możliwość integracji. znalezienie przyjaciela w prawdziwym życiu, poznanego w internecie nigdy nie było łatwiejsze. z tym serwerem, które przeznaczone jest dla komunikacji, ale też dla zdrowej zabawy. z licznymi event'ami, na pewno znajdziesz kogoś, kto łączy z tobą zainteresowania i stanie się twoim kumplem. ${'(´▽`ʃ♡ƪ)'} \n\nmam nadzieję, że pomogłem zrozumieć ten enigmatyczny system. jeżeli masz pytania użyj /help. pytania możesz też kierować do mojego twórcy, ${userMention('559102020070670336')}'em :D` })
        console.log(`wyświetlono ${interaction.member.username} powody, dlaczego personalizacja profilu jest korzystna`)
        return;
    }

    if (interaction.customId === 'personalizacja' && debounce == false) {
        debounce = true
        const checkforverchan = await checkforverchannel(interaction.user.id, interaction.guild, false)

        //if a ver channel is not found then create a new channel
        if (!checkforverchan) {
            
            createverchan(interaction.guild, interaction.member, false, interaction)
            console.log(`${interaction.member} stworzył nową sesję personalizacji`)
        }
        //a ver channel was found
        else {
            const verchan = await interaction.guild.channels.fetch(checkforverchan)

            if (verchan.permissionsFor(interaction.member).has(PermissionsBitField.Flags.ViewChannel)) { //checks if the user has access to view the channel
                interaction.reply({
                    ephemeral: true,
                    content: `spójrz, czy nie masz dostępnego kanału z personalizacją! (${verchan})`
                })
                console.log(`${interaction.member} chciał zrobić nową sesję personalizacji, ale ma już do jednej dostęp`)
            }
            else { //if the user can't see the channel in question then asks if you want a new channel or to continue your old one
                interaction.reply({
                    ephemeral: true,
                    content: "chcesz kontynuować starą sesję, czy rozpocząć od nowa?",
                    components: [veroptions],
                })
                console.log(`${interaction.member} chciał zrobić nową sesję personalizacji, ale ma już jedną do którego nie ma dostępu`)
            }
        }
    }
    setTimeout(() => {debounce = false},1000) 
}