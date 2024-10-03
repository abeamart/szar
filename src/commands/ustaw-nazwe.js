require('dotenv').config();
const setnickname = require('../models/setnickname')
const dbdata = require('../models/dbdata')
const { SlashCommandBuilder } = require('discord.js');

module.exports = {

  data: new SlashCommandBuilder()
    .setName('ustaw-nazwę')
    .setDescription("wybierz, które dane powinny pokazywać się w twojej nazwie")
    .addBooleanOption(option =>
      option.setName('imię')
        .setDescription('czy chcesz, żeby imię pokazywało się w twojej nazwie?'))
    .addBooleanOption(option =>
      option.setName('nick')
        .setDescription('czy chcesz, żeby nick pokazywał się w twojej nazwie?'))
    .addBooleanOption(option =>
      option.setName('nazwisko')
        .setDescription('czy chcesz, żeby nazwisko pokazywało się w twojej nazwie?'))
    .addBooleanOption(option =>
      option.setName('klasa')
        .setDescription('czy chcesz, żeby klasa pokazywała się w twojej nazwie?')),


  run: async ({ interaction, client, handler }) => {

    const check = [
      [interaction.options.getBoolean('imię'), "name"],
      [interaction.options.getBoolean('nick'), "desirednick"],
      [interaction.options.getBoolean('nazwisko'), "surname"],
      [interaction.options.getBoolean('klasa'), "grade"]
    ]

    const guydb = await dbdata.findOne({ Id: interaction.member.id })

    check.forEach(async el => {
      const obj = el[0]
      const ref = el[1]

      if (obj !== null) {

        if (obj == true) {
          if (guydb.info.desirednickname.includes(ref) == false) {

            await dbdata.findByIdAndUpdate(guydb.id,
              { $push: { [`info.desirednickname`]: ref } })

          }
        }
        else {
          await dbdata.findByIdAndUpdate(guydb.id,
            { $pull: { [`info.desirednickname`]: ref } })
        }
      }
    });
    setnickname(interaction, interaction.member)
    interaction.reply('zmieniono nazwę użytkownika ^_~')
  }
}