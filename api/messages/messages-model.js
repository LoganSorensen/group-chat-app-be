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
    return db('messages')
    .select("messages.id", "messages.message_title", "messages.message_text", "messages.user_id", "messages.channel_id")
}

function getById(id){
    return db("messages").where({id}).first();
}

function getBy(filter){
    return db("messages").where({filter})
}

function remove(id){
    return db("messages").where({id}).del()
}

function modify(id, changes){
    return db("messages")
    .where({id})
    .update(changes)
    .then(()=>{
        return findById(id)
    })
}

async function add(message){
    const [id] = await db("messages").insert(message)
    return findById(id)
}