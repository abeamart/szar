
module.exports = async (method, id) => {

    let memnick
    await method.fetch(id).then(fetched => {
        if (fetched.id == id) {
            memnick = fetched
        }
        else throw new Error('nie znaleziono')
    }).catch(error => { console.log(error) })

    if (!memnick) return false
    else {
        return memnick
    }

}