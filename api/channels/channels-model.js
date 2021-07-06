const db = require('../../data/db-config')

module.exports = {
    getAll,
    getById,
    getBy,
    remove,
    modify,
    add
}

function getAll(){
    return db('channels')
    .select("channels.id", "channels.channel_name", "channels.channel_description", "channels.owner_id")
}

function getById(id){
    return db("channels").where({id}).first();
}

function getBy(filter){
    return db("channels").where({filter})
}

function remove(id){
    return db("channels").where({id}).del()
}

function modify(id, changes){
    return db("channels")
    .where({id})
    .update(changes)
    .then(()=>{
        return findById(id)
    })
}

async function add(channel){
    const [id] = await db("channels").insert(channel)
    return findById(id)
}