const zasady = ["przestrzegaj warunków korzystania z discorda (<https://discord.com/terms>)",
    "nie spam'uj",
    "nie flood'uj",
    "korzystaj z odpowiednich kanałów do odpowiednich działań",
    "nie wykorzystuj niedoskonałości i usterek szara",
    "nie obciążaj mnie niepotrzebnie",
    "nie podszywaj się pod kogoś innego podczas personalizacji profilu"
]
const odmiany = ["pierwsza",
  "druga",
  "trzecia",
  "czwarta",
  "piąta",
  "szósta",
  "siódma"

]
const { SlashCommandBuilder } = require('discord.js');

module.exports = {

  data: new SlashCommandBuilder()
    .setName('zasady')
    .setDescription("wybierz zasadę, by przypomnieć rówieśniką o przyzwoitości")
    .addNumberOption(option =>
      option.setName('która-zasada')
        .setDescription('którą zasadę serwera chcesz zacytować').setRequired(true).setMaxValue(7).setMinValue(1)),

  run: async({ interaction, client, handler }) => {
      await interaction.deferReply()
    const index = interaction.options.getNumber('która-zasada')
    interaction.editReply(`${odmiany[index-1]} zasada głosi "${zasady[index-1]}"`)
  },
};
