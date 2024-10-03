const dbdata = require('../../models/dbdata')
module.exports = async (argument, client, handler) => {
    console.log(await dbdata.findOneAndDelete({ Id: argument.id }))
}