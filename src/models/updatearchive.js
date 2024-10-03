const archivedb = require('../models/archivedb')
const { EmbedBuilder } = require("discord.js");
module.exports = async (guild) => {
    try
    {const query = {
        dateobj: {
            $lte: Date.now()
        }
    }
    const results = await archivedb.find(query)

    for (const post of results) {
        const { Id, messageid, date, description, type } = post
        
            await guild.channels.fetch(Id).then(async chan => {
                console.log(chan.parent)
                console.log(chan.parent.parent)
                const archchan = await chan.parent.parent.children.cache.find(ch => ch.name === 'archiwa');
                const archiveembed = new EmbedBuilder().setColor('#a85cc6').setTimestamp()
                .addFields({ name: ' ', value: `czas wydarzenia: **${date}**\ntyp: **${type}**` })
                if (description !== 'brak' && description) {
                    archiveembed.setTitle(description)
                } else {archiveembed.setTitle(`Nowe zarchiwizowane wydarzenie!`)}
                archchan.send({embeds: [archiveembed]})
                chan.delete()})
         .catch (error => {
            console.log(error)
        })
        

        
        
    }
   await archivedb.deleteMany(query)} catch (error) {console.log(error)}
}