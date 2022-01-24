let c_users = []

function join_User (id, username, room) {
    const p_user = {id, username, room}
    c_users.push(p_user);
    console.log(c_users)
    return p_user;
}

function get_Current_User (id) { 
    return c_users.find((p_user) => p_user.id === id) 
}


function user_Disconnect(id){
    const index = c_users.find((p_user) => p_user.id === id)
    if(index !== -1){
        return c_users.splice(index, 1)[0];
    }
    console.log(c_users)
}

console.log(c_users)
module.exports = {
    join_User,
    get_Current_User,
    user_Disconnect,
};