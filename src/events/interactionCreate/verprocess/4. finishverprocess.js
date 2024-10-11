const dbdata = require('../../../models/dbdata')
const canfetch = require('../../../models/canfetch')
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle,TextInputBuilder,ModalBuilder, TextInputStyle } = require("discord.js");
require('dotenv').config();

const modalreason = new TextInputBuilder().setCustomId('vermodalname').setLabel("powód:").setStyle(TextInputStyle.Short).setRequired(false).setValue('podszywanie się')
const modalrow = new ActionRowBuilder().addComponents(modalreason);
const modalkickreason = new ModalBuilder().setCustomId('modalkickreason').addComponents(modalrow);

const exampleEmbed = new EmbedBuilder().setColor('#248046')

const deleteembed = new EmbedBuilder().setColor('#DA373C').setTitle('Uwaga!').setDescription('ten kanał nie należy do nikogo.. chcesz go usunąć?')
const row = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('deletechan').setLabel('usunąć?').setStyle(ButtonStyle.Danger));

module.exports = async (interaction, client, handler) => {
    if (!interaction.isButton()) return;

    if (interaction.customId === 'approveverprof') {
        await interaction.deferUpdate().then(async () => {
            if (await interaction.member.roles.cache.has(process.env.ADMIN_ROLE) == false) {
                interaction.editReply({ content: 'tylko moderator może użyć tego przycisku ;( poczekaj cierpliwie! :D', ephemeral: true })
                console.log(`${interaction.member.username} próbował spersonalizować czyiś profil, ale nie jest moderatorem`)
                return;
    
            }
    
            const userprof = await canfetch(interaction.guild.members, interaction.channel.topic)
    
            if (userprof == false) {
                if (await interaction.member.roles.cache.has(process.env.ADMIN_ROLE) == true) {
                    interaction.editReply({ components: [row], embeds: [deleteembed] })
                }
                else { interaction.editReply({ content: 'ten kanał do nikogo nie należy.. ' }) }
                console.log(`próbowano zatwierdzić profil personalizacji nieznanego użytkownika`); return
            }
    
            const dbprof = await dbdata.findOne({ Id: interaction.channel.topic })
            const dbverified = dbprof.verified
    
            const updatearray = [
                [dbprof.info.unverdesiredinfo.name, 'imię'], //name
                [dbprof.info.unverdesiredinfo.desirednick, 'nick'], //nick
                [dbprof.info.unverdesiredinfo.surname, 'nazwisko'], //surname
                [dbprof.info.unverdesiredinfo.grade, 'klasa'], //grade
            ]
    
            await dbdata.findByIdAndUpdate(dbprof.id, {
                [`info.name`]: updatearray[0][0], [`info.desirednick`]: updatearray[1][0], [`info.surname`]: updatearray[2][0], [`info.grade`]: updatearray[3][0],
                verified: true
            })
    
            //add neccessary roles
            await userprof.roles.add(process.env.MEMBER_ROLE).then(userprof => console.log(`gave ${userprof} member pemissions`))
                .catch(console.error);
    
            //delete the chan
            await interaction.guild.channels.delete(interaction.channel)
    
            //make the information string for later
            let newinfostring = ''
            updatearray.forEach(el => {
                if (el[0] !== "") { newinfostring += `${el[1]}: ${el[0]}\n` }
            });
            if (newinfostring == '') { newinfostring = 'brak\n' }
    
            //setup the embed
            if (dbverified == true) {
                exampleEmbed.setFields({ name: ' ', value: `**twoja personalizacja profilu przeszła pomyślnie!** \n\n**twoje dane:**\n${newinfostring}` },)
            } else {
                exampleEmbed.setTitle('Gratulacje! (/≧▽≦)/')
                  //  .setImage('https://upload.wikimedia.org/wikipedia/commons/f/f1/2ChocolateChipCookies.jpg')
                    .setFields({ name: ' ', value: `**twoja personalizacja profilu przeszła pomyślnie!** \njesteś teraz oficjalnym członkiem serwera discord ${interaction.guild.name}!!!!!! :DDDDDDD\n\n**twoje dane:**\n${newinfostring}` },) //\nmiej te pyszne ciasteczko jako podarek związany z twoim powitaniem!!
         
            }
            //dm user to inform that it went successfully
            userprof.send({ embeds: [exampleEmbed] })
            console.log(`udało się spersonalizować profil ${userprof} i wysłać mu wiadomość! (${newinfostring})`)  
        }).catch(error => console.log(error))
        
    }

    else if (interaction.customId === 'denyverprof') {
        //again check if the user is a moderator
        await interaction.deferUpdate().then(async () => {
            if (await interaction.member.roles.cache.has(process.env.ADMIN_ROLE) == false) {
                interaction.editReply({ content: 'tylko moderator może użyć tego przycisku ;( poczekaj cierpliwie! :D', ephemeral: true })
                console.log(`${interaction.member.username} próbował spersonalizować czyiś profil, ale nie jest moderatorem`)
                return;
            }
    
            const mem = await canfetch(interaction.guild.members, interaction.channel.topic)
    
            if (mem == false) {
                console.log(`nie powiodła się próba niepomyślnego zakończenia personalizacji, gdyż nie znaleziono użytkownika `)
                interaction.guild.channels.delete(interaction.channel); return
            }
            modalkickreason.setTitle(`powód niepowodzenia personalizacji ${mem.user.username}`)
            await interaction.showModal(modalkickreason)
            console.log(`powiodło się pokazywanie ${interaction.member} modalu wyrzucania ${mem} `)
            
        }).catch(error => console.log(error))
        

        
    }
}
