const dbdata = require('../models/dbdata')
require('dotenv').config();
const verifcategoryid = process.env.VERIF_CATEGORY

module.exports = async (userid, guild) => {
    console.log('boo')
    const verifcategory = await guild.channels.fetch(verifcategoryid)
    const children = verifcategory.children.cache;
    let chanid = undefined

    children.forEach(ch => {
        console.log(ch)
        if (ch.topic == userid) {
            console.log(ch.id)
            chanid = ch.id
        }
    })
    console.log(`sprawdzono czy jest kanał weryfikacji i otrzymano ${chanid}`)
    return chanid
}