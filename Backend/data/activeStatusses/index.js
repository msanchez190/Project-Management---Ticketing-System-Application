'use strict';
const utils = require('../utils');
const config = require('../../config');
const sql = require('mssql');


const getAll = async () => {
    try {
        let pool = await sql.connect(config.sql);
        const selectAllQuery = "SELECT [ACTIVE_STATUS_ID]  ,[ACTIVE_STATUS_DESC] FROM [dbo].[ACTIVE_STATUS]";
        const activeStatusList = await pool.request().query(selectAllQuery);
        return activeStatusList.recordset;
    } catch (error) {
        console.log(error.message);
    }
}



const getById = async(ACTIVE_STATUS_ID) => {
    try {
        let pool = await sql.connect(config.sql);
        const getByIdQuery ="SELECT [ACTIVE_STATUS_ID]  ,[ACTIVE_STATUS_DESC] FROM [dbo].[ACTIVE_STATUS] WHERE ACTIVE_STATUS_ID = @ACTIVE_STATUS_ID";
      
        const ticketStatus = await pool.request()
                            .input('ACTIVE_STATUS_ID', sql.Int, ACTIVE_STATUS_ID)
                            .query(getByIdQuery);
        return ticketStatus.recordset;
    } catch (error) {
        return error.message;
    }
}

const getByStatus = async(ACTIVE_STATUS_DESC) => {
    try {
        let pool = await sql.connect(config.sql);
        const getByStatus ="SELECT [ACTIVE_STATUS_ID]  ,[ACTIVE_STATUS_DESC] FROM [dbo].[ACTIVE_STATUS] WHERE ACTIVE_STATUS_DESC = @ACTIVE_STATUS_DESC";
        const ticketStatus = await pool.request()
                            .input('ACTIVE_STATUS_DESC', ACTIVE_STATUS_DESC)
                            .query(getByStatus);
        return ticketStatus.recordset;
    } catch (error) {
        return error.message;
    }
}






module.exports = {
    getAll,
    getById,
    getByStatus
}