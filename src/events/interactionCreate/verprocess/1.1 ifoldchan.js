const checkforverchannel = require('../../../models/checkforverchannel')
const createverchan = require('../../../models/createverchan')
const canfetch = require('../../../models/canfetch')
const { PermissionsBitField } = require("discord.js");
require('dotenv').config();

module.exports = async (interaction, client, handler) => {

    if (!interaction.isButton()) return;

    if (interaction.customId === 'verkontynuuj') {
        const verchanid = await checkforverchannel(interaction.user.id, interaction.guild)

        const verchan = await canfetch(interaction.guild.channels, verchanid)
		if (verchan == false) { interaction.reply({ ephemeral: true, content: "hm.. ten kanał został usunięty, kliknij na przycisk 'personalizuj' ponowanie!" })
            console.log(`dla ${interaction.member} próbowano dać dostęp do starego kanału, ale nie istnieje`); return }

        if (!verchan.permissionsFor(interaction.member).has(PermissionsBitField.Flags.ViewChannel)) {
            verchan.permissionOverwrites.set(
                [
                    {
                        id: process.env.ADMIN_ROLE,
                        allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.AttachFiles, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.AddReactions, PermissionsBitField.Flags.UseExternalEmojis, PermissionsBitField.Flags.ManageChannels, PermissionsBitField.Flags.UseApplicationCommands, PermissionsBitField.Flags.EmbedLinks, PermissionsBitField.Flags.ManageRoles, PermissionsBitField.Flags.ReadMessageHistory],
                    },
                    {
                        id: mem.user.id,
                        allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.AttachFiles, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.AddReactions, PermissionsBitField.Flags.UseExternalEmojis, PermissionsBitField.Flags.ReadMessageHistory]
                    },
                    {
                        id: interaction.guild.roles.everyone,
                        deny: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.ReadMessageHistory]
                    }
                ]
            );
            interaction.reply({ ephemeral: true, content: "zrobione!" })
            console.log(`udało się przywrócić ${interaction.member} jego stary kanał personalizacji`)
        } else {
            interaction.reply({ ephemeral: true, content: "spójrz, czy nie masz dostępnego kanału z personalizacją" })
            console.log(`okazuje się, że ${interaction.member} ma dostęp do kanału personalizacji`)
        }


    }


    else if (interaction.customId === 'verodnowa') {
        const verchanid = await checkforverchannel(interaction.user.id, interaction.guild)
        const verchan = await canfetch(interaction.guild.channels, verchanid)
		if (verchan == false) { interaction.reply({ ephemeral: true, content: "hm.. ten kanał został usunięty, kliknij na przycisk 'personalizuj' ponowanie!" })
            console.log(error)
            interaction.reply({ ephemeral: true, content: "okazuje się, że ten kanał został usunięty. stworzę nowy" })
            createverchan(interaction.guild, interaction.member, false)
            console.log(`${interaction.member} chciał stworzyć nowy kanał personalizacji, po tym, jak stary był wykryty, ale okazuje się, że ten stary został usunięty, stworzy się nowy`)
         return }

        if (!verchan.permissionsFor(interaction.member).has(PermissionsBitField.Flags.ViewChannel)) {

            verchan.setTopic('nie ma właściciela')
            verchan.setName(`duplikat-${await interaction.user.username.replace(/[.]/g, '')}`)
            createverchan(interaction.guild, interaction.member, false)
            interaction.deferUpdate()
            console.log(`znaleziono kanał, ale ${interaction.member} nie ma do niego dostępu i stworzono nową sesję personalizacji`)

        } else {
            interaction.reply({ ephemeral: true, content: "masz już dostępną sesję personalizacji!" })
            console.log(`użytkownik ${interaction.member}chciał utworzyć nową sesję personalizacji, ale okazuje się, że ma już do jednej dostęp `)
        }

    }
}