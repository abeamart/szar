const dbdata = require('../../models/dbdata')
module.exports = async (argument, client, handler) => {
    const memberdb = await dbdata.findOne({ Id: argument.id })
    if (memberdb) {
    } else {
        newdata = new dbdata({
            username: argument.user.username,
            Id: argument.id,
            verified: false,
            Type: 'member',
            [`info.desirednickname`]: ['desirednick'],
            [`info.unverdesiredinfo.name`]: '',
            [`info.unverdesiredinfo.desirednick`]: '',
            [`info.unverdesiredinfo.surname`]: '',
            [`info.unverdesiredinfo.grade`]: ''

        });
        await newdata.save();
    }

}