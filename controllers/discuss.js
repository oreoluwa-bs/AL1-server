const users = [];

const addUser = ({ id, userData, room }) => {
    const name = `${userData.firstname.trim()} ${userData.lastname.trim()}`;
    // eslint-disable-next-line no-param-reassign
    room = room.trim();

    // eslint-disable-next-line no-underscore-dangle
    const existingUser = users.find((user) => user.room === room && user.dbID === userData._id);

    if (!name || !room) return { error: 'Username and room are required.' };
    if (existingUser) {
        return { error: 'Username is taken' };
    }

    const user = {
        id,
        name,
        room,
        // eslint-disable-next-line no-underscore-dangle
        dbID: userData._id,
    };

    users.push(user);
    return { user };
};

// eslint-disable-next-line consistent-return
const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
    // users = users.filter((user) => user.id !== id);
};

const getUser = (id) => users.find((user) => user.id === id);

const getUsersInRoom = (room) => users.filter((user) => user.room === room);

module.exports = {
    // findUser,
    addUser,
    removeUser,
    getUser,
    getUsersInRoom,
};
