
const checkforverchannel = require('./checkforverchannel');
const dbdata = require('./dbdata');
const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, PermissionsBitField, ButtonStyle, ChannelType } = require("discord.js");
require('dotenv').config();



const exampleEmbed = new EmbedBuilder()
    .setColor('#248046')
    .addFields(
        { name: ' ', value: '**tutaj możesz podzielić się imieniem, pożądanym nickiem, nazwiskiem i klasą,**\n\njeżeli nie chcesz podawać jakiejś informacji - zostaw puste miejsce, \npamiętaj, że zawsze możesz apelować o zmianę podanych informacji,\njeżeli masz jakieś pytania, bądź chcesz coś przekazać, zrób to na czacie poniżej' },
        { name: '! ostrzeżenie od discorda !', value: 'ostrzeżenie istnieje, by zapobiec złośliwym botom. (ja taki nie jestem >:())\ninformacje, które podasz są pospolite i są użyteczne tylko dla uczestników serwera. ^_^' })

const verifymodaltrigger = new ButtonBuilder()
    .setCustomId('verifymodaltrigger')
    .setLabel('personalizuj swój profil!')
    .setStyle(ButtonStyle.Success)

const row2 = new ActionRowBuilder()
    .addComponents(verifymodaltrigger);



module.exports = async (guild, mem, dootherchancheck, interaction) => {
    if (dootherchancheck == true) {

        const checkforverchan = await checkforverchannel(mem.id, guild)

        if (checkforverchan) {
            const verchan = await guild.channels.fetch(checkforverchan)

            const newname = `duplikat-${await mem.user.username.replace(/[.]/g, '')}`
            verchan.setTopic('nie ma właściciela')
            verchan.setName(newname)

            console.log(`podmieniono ${checkforverchan} na duplikat`)
        }
    }

    guild.channels.create({

        name: `ustawianie-profilu-${mem.user.username}`,
        type: ChannelType.GuildText,
        parent: process.env.VERIF_CATEGORY,
        permissionOverwrites:
            [
                {
                    id: process.env.ADMIN_ROLE,
                    allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.AttachFiles, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.AddReactions, PermissionsBitField.Flags.UseExternalEmojis, PermissionsBitField.Flags.ManageChannels, PermissionsBitField.Flags.UseApplicationCommands, PermissionsBitField.Flags.EmbedLinks, PermissionsBitField.Flags.ManageRoles],
                },
                {
                    id: mem.user.id,
                    allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.AttachFiles, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.AddReactions, PermissionsBitField.Flags.UseExternalEmojis, PermissionsBitField.Flags.ReadMessageHistory]
                },
                {
                    id: guild.roles.everyone,
                    deny: [PermissionsBitField.Flags.ViewChannel]
                }]
    }).then(async (ch) => {
        const dbuser = await dbdata.findOne({ Id: mem.user.id })

        let greetings = [`Witaj ${mem}!`, `Miło cię widzieć ${mem}!`, `Hej ${mem}!`, `Hejka ${mem}!`]
        if (dbuser.verified == true) { greetings = [`Witaj ponownie ${mem}!`, `Miło cię znowu widzieć ${mem}!`,`Jak się masz ${mem}?`] }

        exampleEmbed.setDescription(`# ${greetings[(Math.floor(Math.random() * greetings.length))]}`)
        ch.setTopic(mem.user.id)
        ch.send({
            embeds: [exampleEmbed],
            components: [row2]
        })
        if (interaction) {
            interaction.reply({ ephemeral: true, content: `nowy kanał personalizacji został stworzony! (${ch})` })
        }
        console.log(`stworzono nowy kanał personalizacji dla ${mem} (${ch.id})`)
    })
}
