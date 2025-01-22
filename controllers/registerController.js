const usersDB = {
    users : require('../model/user.json'),
    setUsers: function (data) {this.users = data}
}

const fsPrmomises = require('fs').promises;
const path = require('path')
const bcrypt = require('bcryptjs')

const handleNewUser = async (req, res) => {
    const { user, pwd  } = req.body;
    if(!user || !pwd) return res.status(400).json({'message': 'Username and password are Required.'});


    const duplicate = usersDB.users.find(person => person.username === user);

    if(duplicate) return res.sendStatus(409);

    try {
        const hashedPwd = await bcrypt.hash(pwd , 10);
        const newUser = {"Username " : user, 'password' : hashedPwd};
        usersDB.setUsers([...usersDB.users, newUser])
        await fsPrmomises.writeFile(
            path.join(__dirname, '..', 'model', 'users.json'),
            JSON.stringify(usersDB.users)
        )
        res.status(200).json({'sucsses': `New User was created ${user}`})
    } catch (error) {
        res.status(500).json({'message' : error.message})
    }
}

module.exports = {handleNewUser}