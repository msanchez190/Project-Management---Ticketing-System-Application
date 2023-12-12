'use strict';
const utils = require('../utils');
const config = require('../../config');
const sql = require('mssql');


const getPriorities = async () => {
    try {
        let pool = await sql.connect(config.sql);
        const selectAllPrioritiesQuery = "SELECT dbo.TICKET_PRIORITY.TICKET_PRIORITY_ID, dbo.TICKET_PRIORITY.TICKET_PRIORITY_DESC, "+
        " dbo.TICKET_PRIORITY.ACTIVE_STATUS_ID, dbo.ACTIVE_STATUS.ACTIVE_STATUS_DESC "+
        " FROM dbo.ACTIVE_STATUS INNER JOIN dbo.TICKET_PRIORITY ON dbo.ACTIVE_STATUS.ACTIVE_STATUS_ID = dbo.TICKET_PRIORITY.ACTIVE_STATUS_ID "
        const prioritiesList = await pool.request().query(selectAllPrioritiesQuery);
        return prioritiesList.recordset;
    } catch (error) {
        console.log(error.message);
    }
}

const getActivePriorities = async () => {
    try {
        let pool = await sql.connect(config.sql);
        const getActivePrioritiesQuery = "SELECT TICKET_PRIORITY.TICKET_PRIORITY_ID, " +
        " TICKET_PRIORITY.TICKET_PRIORITY_DESC, ACTIVE_STATUS.ACTIVE_STATUS_DESC " +
        " FROM ACTIVE_STATUS INNER JOIN TICKET_PRIORITY ON " +
         " ACTIVE_STATUS.ACTIVE_STATUS_ID = TICKET_PRIORITY.ACTIVE_STATUS_ID "+
         " WHERE ACTIVE_STATUS.ACTIVE_STATUS_DESC = 'ACTIVE'"
        const prioritiesList = await pool.request().query(getActivePrioritiesQuery);
        return prioritiesList.recordset;
    } catch (error) {
        console.log(error.message);
    }
}

const getById = async(TICKET_PRIORITY_ID) => {
    try {
        let pool = await sql.connect(config.sql);
        const priorityByIdQuery = "SELECT [TICKET_PRIORITY_ID] ,[TICKET_PRIORITY_DESC] " +
        " ,[ACTIVE_STATUS_ID] FROM [dbo].[TICKET_PRIORITY]  WHERE [TICKET_PRIORITY_ID] = @TICKET_PRIORITY_ID"
      
        const priority = await pool.request()
                            .input('TICKET_PRIORITY_ID', sql.Int, TICKET_PRIORITY_ID)
                            .query(priorityByIdQuery);
        return priority.recordset;
    } catch (error) {
        return error.message;
    }
}

const createPriority = async (priorityData) => {
    try {
        let pool = await sql.connect(config.sql);
        const createPriority = "INSERT INTO [dbo].[TICKET_PRIORITY] " +
        " ([TICKET_PRIORITY_DESC]  ,[ACTIVE_STATUS_ID])  VALUES "
        + "  (@TICKET_PRIORITY_DESC, @ACTIVE_STATUS_ID)"
        const sqlQueries = await utils.loadSqlQueries('priorities');
        const insertPriority = await pool.request()
                            .input('TICKET_PRIORITY_DESC', sql.NVarChar(30), priorityData.TICKET_PRIORITY_DESC)
                            .input('ACTIVE_STATUS_ID', sql.SmallInt, priorityData.ACTIVE_STATUS_ID)
                          
                            .query(createPriority);                            
        return insertPriority.recordset;
    } catch (error) {
        return error.message;
    }
}

const updatePriority = async (TICKET_PRIORITY_ID, data) => {
    try {
        let pool = await sql.connect(config.sql);
        const updatePriorityQuery = "UPDATE [dbo].[TICKET_PRIORITY] SET [TICKET_PRIORITY_DESC] = @TICKET_PRIORITY_DESC, " +        
        " [ACTIVE_STATUS_ID] = @ACTIVE_STATUS_ID " +
       " WHERE TICKET_PRIORITY_ID = @TICKET_PRIORITY_ID "
        const update = await pool.request()
            .input('TICKET_PRIORITY_ID', sql.Int, TICKET_PRIORITY_ID)
            .input('TICKET_PRIORITY_DESC', sql.NVarChar(20), data.TICKET_PRIORITY_DESC)
            .input('ACTIVE_STATUS_ID', sql.SmallInt, data.ACTIVE_STATUS_ID)
            .query(updatePriorityQuery);
        return update.recordset;
    } catch (error) {
        return error.message;
    }
}

const deletePriority = async (TICKET_PRIORITY_ID) => {
    try {
        let pool = await sql.connect(config.sql);
        const deletePriorityQuery = "DELETE FROM TICKET_PRIORITY WHERE TICKET_PRIORITY_ID = @TICKET_PRIORITY_ID "

        const deletePriority = await pool.request()
                        .input('TICKET_PRIORITY_ID', sql.Int, TICKET_PRIORITY_ID)
                            .query(deletePriorityQuery);
        return deletePriority.recordset;
    } catch (error) {
        return error.message;
    }
}


module.exports = {
    getPriorities,
    getActivePriorities,
    getById,
    createPriority,
    updatePriority,
    deletePriority
}