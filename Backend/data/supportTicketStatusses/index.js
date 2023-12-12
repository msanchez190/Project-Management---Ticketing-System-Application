'use strict';
const utils = require('../utils');
const config = require('../../config');
const sql = require('mssql');


const getAll = async () => {
    try {
        let pool = await sql.connect(config.sql);
        const selectAllQuery = "SELECT [SUPPORT_TICKET_STATUS_ID] "+
        " ,[SUPPORT_TICKET_STATUS_DESC]  ,[ACTIVE_STATUS_ID]  FROM [dbo].[SUPPORT_TICKET_STATUS]";
        const ticketStatusList = await pool.request().query(selectAllQuery);
        return ticketStatusList.recordset;
    } catch (error) {
        console.log(error.message);
    }
}

const getActiveTicketStatusses = async () => {
    try {
        let pool = await sql.connect(config.sql);
        const getActiveQuery = "SELECT   dbo.SUPPORT_TICKET_STATUS.SUPPORT_TICKET_STATUS_ID, "+
        " dbo.SUPPORT_TICKET_STATUS.SUPPORT_TICKET_STATUS_DESC, dbo.ACTIVE_STATUS.ACTIVE_STATUS_DESC "+
        " FROM dbo.ACTIVE_STATUS INNER JOIN   dbo.SUPPORT_TICKET_STATUS ON dbo.ACTIVE_STATUS.ACTIVE_STATUS_ID = dbo.SUPPORT_TICKET_STATUS.ACTIVE_STATUS_ID "+
          " WHERE ACTIVE_STATUS.ACTIVE_STATUS_DESC = 'ACTIVE'"
        const ticketStatusList = await pool.request().query(getActiveQuery);
        return ticketStatusList.recordset;
    } catch (error) {
        console.log(error.message);
    }
}

const getById = async(SUPPORT_TICKET_STATUS_ID) => {
    try {
        let pool = await sql.connect(config.sql);
        const getByIdQuery = "SELECT [SUPPORT_TICKET_STATUS_ID] "+
        " ,[SUPPORT_TICKET_STATUS_DESC]  ,[ACTIVE_STATUS_ID]  FROM [dbo].[SUPPORT_TICKET_STATUS] WHERE SUPPORT_TICKET_STATUS_ID=@SUPPORT_TICKET_STATUS_ID";
      
        const ticketStatus = await pool.request()
                            .input('SUPPORT_TICKET_STATUS_ID', sql.Int, SUPPORT_TICKET_STATUS_ID)
                            .query(getByIdQuery);
        return ticketStatus.recordset;
    } catch (error) {
        return error.message;
    }
}

const createTicketStatus = async (statData) => {
    try {
        let pool = await sql.connect(config.sql);
        const createQuery = "INSERT INTO [dbo].[SUPPORT_TICKET_STATUS] "+
        " ([SUPPORT_TICKET_STATUS_DESC] ,[ACTIVE_STATUS_ID]) VALUES (@SUPPORT_TICKET_STATUS_DESC, @ACTIVE_STATUS_ID)"
        
        const insertTicketStatus = await pool.request()
                            .input('SUPPORT_TICKET_STATUS_DESC', sql.NVarChar(20), statData.SUPPORT_TICKET_STATUS_DESC)
                            .input('ACTIVE_STATUS_ID', sql.SmallInt, statData.ACTIVE_STATUS_ID)
                          
                            .query(createQuery);                            
        return insertTicketStatus.recordset;
    } catch (error) {
        return error.message;
    }
}

const updateTicketStatus = async (SUPPORT_TICKET_STATUS_ID, data) => {
    try {
        let pool = await sql.connect(config.sql);
        const updateQuery = "UPDATE [dbo].[SUPPORT_TICKET_STATUS] SET [SUPPORT_TICKET_STATUS_DESC] = @SUPPORT_TICKET_STATUS_DESC,[ACTIVE_STATUS_ID] = @ACTIVE_STATUS_ID WHERE SUPPORT_TICKET_STATUS_ID=@SUPPORT_TICKET_STATUS_ID "
        const update = await pool.request()
            .input('SUPPORT_TICKET_STATUS_ID', sql.Int, SUPPORT_TICKET_STATUS_ID)
            .input('SUPPORT_TICKET_STATUS_DESC', sql.NVarChar(20), data.SUPPORT_TICKET_STATUS_DESC)
            .input('ACTIVE_STATUS_ID', sql.SmallInt, data.ACTIVE_STATUS_ID)
            .query(updateQuery);
        return update.recordset;
    } catch (error) {
        return error.message;
    }
}

const deleteTicketStatus = async (SUPPORT_TICKET_STATUS_ID) => {
    try {
        let pool = await sql.connect(config.sql);
        const deleteQuery = "DELETE FROM SUPPORT_TICKET_STATUS WHERE SUPPORT_TICKET_STATUS_ID=@SUPPORT_TICKET_STATUS_ID  "

        const deleteTicketStatus = await pool.request()
                        .input('SUPPORT_TICKET_STATUS_ID', sql.Int, SUPPORT_TICKET_STATUS_ID)
                            .query(deleteQuery);
        return deleteTicketStatus.recordset;
    } catch (error) {
        return error.message;
    }
}


module.exports = {
    getAll,
    getActiveTicketStatusses,
    getById,
    createTicketStatus,
    updateTicketStatus,
    deleteTicketStatus
}