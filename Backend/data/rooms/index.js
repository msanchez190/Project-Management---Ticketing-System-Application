'use strict';
const utils = require('../utils');
const config = require('../../config');
const sql = require('mssql');


const getAll = async () => {
    try {
        let pool = await sql.connect(config.sql);
        const selectAllRoomsQuery = "SELECT ROOM_NUMBER FROM dbo.ROOM ORDER BY ROOM_NUMBER";
        const roomsList = await pool.request().query(selectAllRoomsQuery);
        return roomsList.recordset;
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    getAll,
}