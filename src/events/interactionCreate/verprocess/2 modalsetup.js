const dbdata = require('../../../models/dbdata')
const canfetch = require('../../../models/canfetch')
const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");
require('dotenv').config();

//channel deletion components
const deleteembed = new EmbedBuilder().setColor('#DA373C').setTitle('Uwaga!').setDescription('ten kanał nie należy do nikogo.. chcesz go usunąć?')
const row = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('deletechan').setLabel('usunąć?').setStyle(ButtonStyle.Danger));

//making the modals
const varmodalname = new TextInputBuilder().setCustomId('vermodalname').setLabel("imię:").setStyle(TextInputStyle.Short).setRequired(false).setMaxLength(25)
const varmodaldesirednick = new TextInputBuilder().setCustomId('vermodalnick').setLabel("nick:").setStyle(TextInputStyle.Short).setRequired(false).setMaxLength(25)
const varmodalsurname = new TextInputBuilder().setCustomId('vermodalsurname').setLabel("nazwisko:").setStyle(TextInputStyle.Short).setRequired(false).setMaxLength(25)
const varmodalgrade = new TextInputBuilder().setCustomId('vermodalgrade').setLabel("klasa: (np.:\t 2A, 4B, 3G)").setStyle(TextInputStyle.Short).setRequired(false).setMaxLength(2).setMinLength(2)

const modalrow1 = new ActionRowBuilder().addComponents(varmodalname);
const modalrow2 = new ActionRowBuilder().addComponents(varmodaldesirednick);
const modalrow3 = new ActionRowBuilder().addComponents(varmodalsurname);
const modalrow4 = new ActionRowBuilder().addComponents(varmodalgrade);

const vermodalmain = new ModalBuilder().setCustomId('vermodalmain').setTitle('ustaw profil').addComponents(modalrow1, modalrow2, modalrow3, modalrow4);

module.exports = async (interaction, client, handler) => {
	if (!interaction.isButton()) return;

	if (interaction.customId === 'verifymodaltrigger') {

		const memnick = await canfetch(interaction.guild.members, interaction.channel.topic)
		if (memnick == false) { interaction.reply('nie znaleziono użytkownika..')
			if (await interaction.member.roles.cache.has(process.env.ADMIN_ROLE) == true) {
				interaction.channel.send({ components: [row], embeds: [deleteembed] })
			} 
			console.log(`chciano pokazać ${interaction.member} modal personalizacji, ale nie można było znaleźć właściciela personalizacji (${error})`); return 
		}

		vermodalmain.setTitle(`ustaw profil ${memnick.user.username}`)

		const dbprofile = await dbdata.findOne({ Id: interaction.channel.topic })

		const dbunverdesiredinfo = dbprofile.info.unverdesiredinfo
		varmodalname.setValue(dbunverdesiredinfo.name)
		varmodaldesirednick.setValue(dbunverdesiredinfo.desirednick)
		varmodalsurname.setValue(dbunverdesiredinfo.surname)
		if (dbunverdesiredinfo.grade.length == 2) {
			varmodalgrade.setValue(dbunverdesiredinfo.grade)
		}


		await interaction.showModal(vermodalmain)
		console.log(`powiodło się pokazywanie ${interaction.member} modalu ${memnick} `)
	}
}

