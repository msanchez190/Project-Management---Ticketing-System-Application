'use strict';

const roomData = require('../data/rooms');

const GetAllRooms = async (req, res, next) => {
    try {
        const roomsList = await roomData.getAll();
        res.send(roomsList);        
    } catch (error) {
        res.status(400).send(error.message);
    }
}

module.exports = {
    GetAllRooms,
}