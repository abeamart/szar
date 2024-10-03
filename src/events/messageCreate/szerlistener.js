const createverchan = require('../../models/createverchan')
const archivedb = require('../../models/archivedb')
const { ButtonBuilder, ActionRowBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");
const updatearchive = require('../../models/updatearchive')
require('dotenv').config();

const okienkopersonalizacji = new EmbedBuilder().setColor([36, 128, 70]).setTitle('zasady przeczytane?')
    .setDescription('no to czas na **proste, szybkie i przyjemne** ustawienie profilu!\n \n *do ustawienia profilu konieczne jest podanie swoich pospolitych danych (imie/naziskow/klasa) pozwalając potwierzenie twojej tożsamości, aby pomóc moderatorom utrzymanie środowiska czystego od raidów i spamu! (dla całej listy powodów kliknij przycisk "dlaczego" pod okienkiem) \n\n ślicznie dziękuje!* (. ❛ ᴗ ❛.)')

const personalizacja = new ButtonBuilder().setCustomId('personalizacja').setLabel('personalizuj!').setStyle(ButtonStyle.Success);
const powody = new ButtonBuilder().setCustomId('powody').setLabel('dlaczego?').setStyle(ButtonStyle.Primary);
const row = new ActionRowBuilder().addComponents(personalizacja, powody);

module.exports = async (message, client, handler) => {

    const author = message.author
    if (!author.bot || author.id == client.user.id) return;

    const splitmes = message.content.split(' ')
    const command = splitmes[0]
    const arg = splitmes[1]

    if (command == 'botowapersonalizacja') {
        const mem = await message.guild.members.fetch(arg)
        createverchan(message.guild, mem, true)
        message.delete()

    } else if (command == 'oknopersonalizacji') {
        const chan = await message.guild.channels.fetch(arg)
        chan.send({ embeds: [okienkopersonalizacji], components: [row] })
        message.delete()

    } else if (command == 'embedarchiwacji') {

        const dbinfo = await archivedb.findById(arg)
        const chan = await message.guild.channels.fetch(dbinfo.Id)
        const archiveembed = new EmbedBuilder().setColor('#22a2f2').setTitle(`Nowe wydarzenie!`).setTimestamp()
            .addFields({ name: ' ', value: `czas wydarzenia: **${dbinfo.date}**\nopis: **${dbinfo.description}**\ntyp: **${dbinfo.type}**` })

        await chan.send({ embeds: [archiveembed] }).then( async (message) => await dbinfo.updateOne({ messageid: message.id })).catch(console.error);
        updatearchive(await message.guild)
        message.delete()
    }
    console.log(`odpowiedziano na komendę ${command} bota ${author}`)
};
