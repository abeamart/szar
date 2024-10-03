const dbdata = require('../../models/dbdata')
const archivedb = require('../../models/archivedb')
const updatearchive = require('../../models/updatearchive')
require('dotenv').config();

module.exports = async (argument, client, handler) => {



    const guild = await client.guilds.fetch(process.env.SERVER_ID);
    const members = await guild.members.fetch()
    let databaseleft = await dbdata.find()

    let databaseids = databaseleft.map(c => c.Id)
    let membersids = members.map(c => c.id)

    let idstoremove = databaseids.filter((item) => !membersids.includes(item));
    let idstoadd = membersids.filter((item) => !databaseids.includes(item));

    if (idstoremove.length > 0) {
        idstoremove.forEach(async id => {
            console.log(await dbdata.findOneAndDelete({ Id: id }))
        });

    }
    if (idstoadd.length > 0) {
        idstoadd.forEach(async id => {
            const mem = await guild.members.fetch(id)

            newdata = new dbdata({
                username: await mem.user.username,
                Id: id,
                verified: false,
                Type: 'member',
                [`info.desirednickname`]: ['desirednick'],
                [`info.unverdesiredinfo.name`]: '',
                [`info.unverdesiredinfo.desirednick`]: '',
                [`info.unverdesiredinfo.surname`]: '',
                [`info.unverdesiredinfo.grade`]: ''
            });
            await newdata.save();
        });

    }
    console.log(idstoadd, idstoremove)

    const checkforposts = async () => {
        updatearchive(guild)
        setTimeout(checkforposts, 900000)
    }
    checkforposts()


}