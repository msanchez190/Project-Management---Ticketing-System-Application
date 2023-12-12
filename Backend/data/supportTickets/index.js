'use strict';
const utils = require('../utils');
const config = require('../../config');
const sql = require('mssql');


const GetAllJoin = async ({ USER_ID, SUPPORT_TICKET_STATUS, SEARCH_TERM }) => {
    try {
        let pool = await sql.connect(config.sql);
        let selectAllTicketsQ = "SELECT ST.SUPPORT_TICKET_ID "+
        " ,ST.SUPPORT_TICKET_SUBJECT  "+
        " ,ST.SUPPORT_TICKET_NOTE "+
        " ,ST.DEVICE_MAKE "+
        " ,ST.DEVICE_MODEL "+
        " ,ST.SUPPORT_TICKET_TIMELINE "+
        " ,ST.SUPPORT_TICKET_DATE_CREATED "+
        " ,ST.SUPPORT_TICKET_RESOLUTION_TIME "+
        " ,ST.SUPPORT_TICKET_STATUS_ID "+
        " ,STS.SUPPORT_TICKET_STATUS_DESC "+
        " ,ST.TICKET_CATEGORY_ID "+
        " ,ST.TICKET_SUB_CATEGORY_ID "+
        " ,ST.TICKET_PRIORITY_ID "+
        " ,ST.SUPPORT_AGENT_ID "+
        " ,ST.RESOLUTION_DATE "+
        " ,ST.ROOM_NUMBER "+
        " ,ST.END_USER_ID "+
        " ,ST.SUPPORT_TICKET_ASSET_TAG "+
        " ,EU.END_USER_FIRST_NAME "+
        " ,EU.END_USER_LAST_NAME "+
        " ,EU.END_USER_EMAIL "+
        " FROM dbo.SUPPORT_TICKET as ST "+
        " JOIN dbo.SUPPORT_TICKET_STATUS as STS ON ST.SUPPORT_TICKET_STATUS_ID = STS.SUPPORT_TICKET_STATUS_ID " +
        " JOIN dbo.END_USER as EU ON ST.END_USER_ID = EU.END_USER_ID "
        " JOIN dbo.SUPPORT_AGENT_USER as SAU ON SAU.SUPPORT_AGENT_USER_ID = SA.END_USER_ID ";

        if (SUPPORT_TICKET_STATUS || USER_ID || SEARCH_TERM) {
            selectAllTicketsQ += " WHERE"
        }

        const whereClauses = [];

        if (SUPPORT_TICKET_STATUS) {
            whereClauses.push(" ST.SUPPORT_TICKET_STATUS_ID = @SUPPORT_TICKET_STATUS");
        }

        if (USER_ID) {
            whereClauses.push("  ST.END_USER_ID = @USER_ID");
        }

        if (SEARCH_TERM.trim().length > 0) {
            const searchTermWhere = [];
            const searchTerms = SEARCH_TERM.split(' ');
            searchTerms.forEach((searchTerm) => {
                searchTermWhere.push(` (ST.SUPPORT_TICKET_SUBJECT LIKE '%${searchTerm}%' OR EU.END_USER_EMAIL LIKE '%${searchTerm}%')`);
            })

            whereClauses.push('(' + searchTermWhere.join(' OR ') + ')');
        }

        // if there's more than 1, put together the clauses with AND
        selectAllTicketsQ += whereClauses.join(" AND ");

        console.log('query', selectAllTicketsQ);
        const supportTicketsList = await pool.request()
                            .input('SUPPORT_TICKET_STATUS', sql.Int, SUPPORT_TICKET_STATUS)
                            .input('USER_ID', sql.Int, USER_ID)
                            .query(selectAllTicketsQ);
        return supportTicketsList.recordset;
    } catch (error) {
        console.log(error.message);
    }
}


const GetAll = async () => {
    try {
        let pool = await sql.connect(config.sql);
        const selectAllTicketsQ = "SELECT [SUPPORT_TICKET_ID] "+
        " ,[SUPPORT_TICKET_SUBJECT]  "+
        " ,[SUPPORT_TICKET_NOTE] "+
        " ,[DEVICE_MAKE] "+
        " ,[DEVICE_MODEL] "+
        " ,[SUPPORT_TICKET_TIMELINE] "+
        " ,[SUPPORT_TICKET_DATE_CREATED] "+
        " ,[SUPPORT_TICKET_RESOLUTION_TIME] "+
        " ,[SUPPORT_TICKET_STATUS_ID] "+
        " ,[TICKET_CATEGORY_ID] "+
        " ,[TICKET_SUB_CATEGORY_ID] "+
        " ,[TICKET_PRIORITY_ID] "+
        " ,[SUPPORT_AGENT_ID] "+
        " ,[RESOLUTION_DATE] "+
        " ,[END_USER_ID] "+
        " ,[SUPPORT_TICKET_ASSET_TAG] "+
        " FROM [dbo].[SUPPORT_TICKET] "
        const supportTicketsList = await pool.request().query(selectAllTicketsQ);
        return supportTicketsList.recordset;
    } catch (error) {
        console.log(error.message);
    }
}

const GetAssignedByUserId = async ({ USER_ID, SUPPORT_TICKET_STATUS, SEARCH_TERM }) => {
    try {
        let pool = await sql.connect(config.sql);
        let selectAllTicketsQ = "SELECT ST.SUPPORT_TICKET_ID "+
        " ,ST.SUPPORT_TICKET_SUBJECT  "+
        " ,ST.SUPPORT_TICKET_NOTE "+
        " ,ST.DEVICE_MAKE "+
        " ,ST.DEVICE_MODEL "+
        " ,ST.SUPPORT_TICKET_TIMELINE "+
        " ,ST.SUPPORT_TICKET_DATE_CREATED "+
        " ,ST.SUPPORT_TICKET_RESOLUTION_TIME "+
        " ,ST.SUPPORT_TICKET_STATUS_ID "+
        " ,STS.SUPPORT_TICKET_STATUS_DESC "+
        " ,ST.TICKET_CATEGORY_ID "+
        " ,ST.TICKET_SUB_CATEGORY_ID "+
        " ,ST.TICKET_PRIORITY_ID "+
        " ,ST.SUPPORT_AGENT_ID "+
        " ,ST.RESOLUTION_DATE "+
        " ,ST.END_USER_ID "+
        " ,ST.SUPPORT_TICKET_ASSET_TAG "+
        " ,EU.END_USER_FIRST_NAME "+
        " ,EU.END_USER_LAST_NAME "+
        " ,EU.END_USER_EMAIL "+
        " FROM dbo.SUPPORT_TICKET as ST "+
        " JOIN dbo.SUPPORT_TICKET_STATUS as STS ON ST.SUPPORT_TICKET_STATUS_ID = STS.SUPPORT_TICKET_STATUS_ID " +
        " JOIN dbo.END_USER as EU ON ST.END_USER_ID = EU.END_USER_ID " +
        " JOIN dbo.SUPPORT_AGENT_USER as SAU ON SAU.SUPPORT_AGENT_USER_ID = ST.SUPPORT_AGENT_ID " +
        " WHERE SAU.END_USER_ID = @END_USER_ID";
        if (SUPPORT_TICKET_STATUS) {
            selectAllTicketsQ += " AND ST.SUPPORT_TICKET_STATUS_ID = @SUPPORT_TICKET_STATUS ";
        }

        if (SEARCH_TERM.trim().length > 0) {
            const searchTermWhere = [];
            const searchTerms = SEARCH_TERM.split(' ');
            searchTerms.forEach((searchTerm) => {
                searchTermWhere.push(` (ST.SUPPORT_TICKET_SUBJECT LIKE '%${searchTerm}%' OR EU.END_USER_EMAIL LIKE '%${searchTerm}%')`);
            })

            selectAllTicketsQ += ' AND (' + searchTermWhere.join(' OR ') + ')';
        }

        const supportTicketsList = await pool.request()
                            .input('END_USER_ID', sql.Int, USER_ID)
                            .input('SUPPORT_TICKET_STATUS', sql.Int, SUPPORT_TICKET_STATUS)
                            .query(selectAllTicketsQ);
        return supportTicketsList.recordset;
    } catch (error) {
        console.log(error.message);
    }
}


const getByIdJoin = async(SUPPORT_TICKET_ID) => {
    try {
        let pool = await sql.connect(config.sql);
        const selectAllTicketsQ = "SELECT ST.SUPPORT_TICKET_ID, ST.SUPPORT_TICKET_SUBJECT, ST.SUPPORT_TICKET_NOTE, ST.DEVICE_MAKE, "+
        " ST.DEVICE_MODEL, ST.SUPPORT_TICKET_TIMELINE, ST.SUPPORT_TICKET_DATE_CREATED, ST.SUPPORT_TICKET_RESOLUTION_TIME, "+
        " ES.END_USER_ID, ES.END_USER_FIRST_NAME, ES.END_USER_LAST_NAME, STS.SUPPORT_TICKET_STATUS_ID, "+
        " STS.SUPPORT_TICKET_STATUS_DESC, TC.TICKET_CATEGORY_ID, TC.TICKET_CATEGORY_DESC, TP.TICKET_PRIORITY_ID, "+
        " TP.TICKET_PRIORITY_DESC, ST.RESOLUTION_DATE, SA.SUPPORT_AGENT_ID, SA.SUPPORT_AGENT_FIRST_NAME, "+
        " SA.SUPPORT_AGENT_LAST_NAME, TSC.TICKET_SUB_CATEGORY_ID, TSC.TICKET_SUB_CATEGORY_DESC "+
        " FROM dbo.SUPPORT_TICKET as ST INNER JOIN "+
        " dbo.END_USER as ES ON ST.END_USER_ID = ES.END_USER_ID INNER JOIN "+
        " dbo.SUPPORT_TICKET_STATUS as STS ON ST.SUPPORT_TICKET_STATUS_ID = STS.SUPPORT_TICKET_STATUS_ID INNER JOIN " +
        " dbo.TICKET_CATEGORY as TC ON ST.TICKET_CATEGORY_ID = TC.TICKET_CATEGORY_ID INNER JOIN "+
        " dbo.TICKET_PRIORITY as TP ON ST.TICKET_PRIORITY_ID = TP.TICKET_PRIORITY_ID LEFT OUTER JOIN "+
        " dbo.SUPPORT_AGENT as SA ON ST.SUPPORT_AGENT_ID = SA.SUPPORT_AGENT_ID LEFT OUTER JOIN "+
        " dbo.TICKET_SUB_CATEGORY as TSC ON ST.TICKET_SUB_CATEGORY_ID = TSC.TICKET_SUB_CATEGORY_ID "+
        " WHERE SUPPORT_TICKET_ID = @SUPPORT_TICKET_ID"
        const supportTicket = await pool.request()
                            .input('SUPPORT_TICKET_ID', sql.Int, SUPPORT_TICKET_ID)
                            .query(selectAllTicketsQ);
        return subCategory.recordset;
    } catch (error) {
        return error.message;
    }
}

const getById = async(SUPPORT_TICKET_ID) => {
    try {
        let pool = await sql.connect(config.sql);
        const selectAllTicketsQ = "SELECT " +
        " ST.DEVICE_MAKE, " +
        " ST.DEVICE_MODEL, " +
        " ST.END_USER_ID, " +
        " ST.RESOLUTION_DATE, " +
        " ST.ROOM_NUMBER, " +
        " ST.SUPPORT_AGENT_ID, " +
        " ST.SUPPORT_TICKET_ASSET_TAG, " +
        " ST.SUPPORT_TICKET_DATE_CREATED, " +
        " ST.SUPPORT_TICKET_ID, " +
        " ST.SUPPORT_TICKET_NOTE, " +
        " ST.SUPPORT_TICKET_RESOLUTION_TIME, " +
        " ST.SUPPORT_TICKET_STATUS_ID, " +
        " ST.ROOM_NUMBER, " +
        " STS.SUPPORT_TICKET_STATUS_DESC, "+
        " ST.SUPPORT_TICKET_SUBJECT, " +
        " ST.SUPPORT_TICKET_TIMELINE, " +
        " ST.TICKET_CATEGORY_ID, " +
        " TC.TICKET_CATEGORY_DESC, " +
        " ST.TICKET_PRIORITY_ID, " +
        " ST.TICKET_SUB_CATEGORY_ID, " +
        " EU.END_USER_EMAIL "+
        " FROM [dbo].[SUPPORT_TICKET] ST " +
        " JOIN dbo.TICKET_CATEGORY TC ON TC.TICKET_CATEGORY_ID = ST.TICKET_CATEGORY_ID" + 
        " JOIN dbo.SUPPORT_TICKET_STATUS as STS ON ST.SUPPORT_TICKET_STATUS_ID = STS.SUPPORT_TICKET_STATUS_ID " +
        " JOIN dbo.END_USER as EU ON ST.END_USER_ID = EU.END_USER_ID " +
        " WHERE ST.SUPPORT_TICKET_ID=@SUPPORT_TICKET_ID "
        const supportTicket = await pool.request()
                            .input('SUPPORT_TICKET_ID', sql.Int, SUPPORT_TICKET_ID)
                            .query(selectAllTicketsQ);
        return supportTicket.recordset;
    } catch (error) {
        return error.message;
    }
}

const getTicketCountByCat = async () => {
    try {
        let pool = await sql.connect(config.sql);
        const countTicketByCat = "SELECT TC.TICKET_CATEGORY_DESC, "+
            "COUNT(ST.TICKET_CATEGORY_ID) AS NUMBER_OF_TICKETS_BY_CAT "+
            "FROM [dbo].[SUPPORT_TICKET] AS ST "+
            "RIGHT JOIN [dbo].[TICKET_CATEGORY] AS TC "+
            "ON ST.TICKET_CATEGORY_ID = TC.TICKET_CATEGORY_ID "+
            "GROUP BY TICKET_CATEGORY_DESC"
        const countResult = await pool.request().query(countTicketByCat);
        return countResult.recordset;
    } catch(error) {
        return error.message;
    }
}

const getTicketCountByCatPerUser = async (END_USER_ID) => {
    try {
        let pool = await sql.connect(config.sql);
        const countTicketByCatPerUser = "SELECT TC.TICKET_CATEGORY_DESC, "+
            "COUNT(ST.SUPPORT_TICKET_ID) AS NUMBER_OF_TICKETS_BY_CAT "+
            "FROM [dbo].[TICKET_CATEGORY] AS TC "+
            "LEFT JOIN (SELECT DISTINCT TICKET_CATEGORY_ID, SUPPORT_TICKET_ID, END_USER_ID FROM [dbo].[SUPPORT_TICKET] "+
            "WHERE END_USER_ID = @END_USER_ID) AS ST "+
            "ON TC.TICKET_CATEGORY_ID = ST.TICKET_CATEGORY_ID "+
            "GROUP BY TC.TICKET_CATEGORY_DESC"
        const result = await pool.request()
                .input('END_USER_ID', sql.Int, END_USER_ID)
                .query(countTicketByCatPerUser);
        return result.recordset;
    } catch(error) {
        return error.message;
    }
}

const getTicketCountPerSupport = async () => {
    try {
        let pool = await sql.connect(config.sql);
        const countPerSupport = "SELECT CONCAT(END_USER_FIRST_NAME, ' ', END_USER_LAST_NAME) AS SUPPORT_AGENT, "+
            "COUNT(SUPPORT_TICKET_ID) AS NUMBER_OF_ASSIGNED_TICKETS "+
            "FROM dbo.SUPPORT_TICKET AS ST "+   
            "JOIN dbo.SUPPORT_AGENT_USER AS SAU "+
            "ON ST.SUPPORT_AGENT_ID = SAU.SUPPORT_AGENT_USER_ID "+
            "JOIN dbo.END_USER as EU "+
            "ON SAU.END_USER_ID = EU.END_USER_ID "+
            "GROUP BY EU.END_USER_FIRST_NAME, EU.END_USER_LAST_NAME"
        const numberPerSupport = await pool.request().query(countPerSupport)
        return numberPerSupport.recordset
    } catch(error) {
        return error.message;
    }
}

const getTop5TicketPerUser = async (END_USER_ID) => {
    try{
        let pool = await sql.connect(config.sql);
        const top5Tickets = "SELECT TOP(5) FORMAT(ST.SUPPORT_TICKET_DATE_CREATED, 'dd MMM yyyy') AS DATE_CREATED, "+
            "ST.SUPPORT_TICKET_SUBJECT, STS.SUPPORT_TICKET_STATUS_DESC, "+
            "TP.TICKET_PRIORITY_DESC "+
            "FROM dbo.SUPPORT_TICKET AS ST "+
            "JOIN dbo.SUPPORT_TICKET_STATUS AS STS "+
            "ON ST.SUPPORT_TICKET_STATUS_ID = STS.SUPPORT_TICKET_STATUS_ID "+
            "JOIN dbo.TICKET_PRIORITY AS TP "+
            "ON ST.TICKET_PRIORITY_ID = TP.TICKET_PRIORITY_ID "+
            "WHERE ST.END_USER_ID = @END_USER_ID "+
            "ORDER BY ST.SUPPORT_TICKET_DATE_CREATED DESC"
        const res = await pool.request()
            .input('END_USER_ID', sql.SmallInt, END_USER_ID)
            .query(top5Tickets);
        return res.recordset;
    } catch (error) {
        return error.message;
    }
}

const getResolvedTicketCountPerMonth = async () => {
    try {
        let pool = await sql.connect(config.sql);
        const closedTicketPerMonth = "SELECT FORMAT(ST.RESOLUTION_DATE, 'MM-yyyy') AS MONTHYEAR, "+
            "COUNT(ST.SUPPORT_TICKET_NOTE) AS CLOSED_TICKETS_COUNT "+
            "FROM dbo.SUPPORT_TICKET AS ST "+
            "JOIN dbo.SUPPORT_TICKET_STATUS AS STS "+
            "ON ST.SUPPORT_TICKET_STATUS_ID = STS.SUPPORT_TICKET_STATUS_ID "+
            "WHERE STS.SUPPORT_TICKET_STATUS_DESC = 'CLOSED' "+
            "GROUP BY FORMAT(ST.RESOLUTION_DATE, 'MM-yyyy') "+
            "ORDER BY MONTHYEAR"
        const closedTicketsCount = await pool.request().query(closedTicketPerMonth);
        return closedTicketsCount.recordset;
    } catch(error) {
        return error.message;
    }
}

const insertNew = async (supportTicketData) => {
    let pool = await sql.connect(config.sql);
    const createSupportTicket = "INSERT INTO [dbo].[SUPPORT_TICKET] "+
    " ([SUPPORT_TICKET_SUBJECT] "+
    " ,[SUPPORT_TICKET_NOTE] "+
    " ,[DEVICE_MAKE] "+
    " ,[DEVICE_MODEL] "+
    " ,[SUPPORT_TICKET_TIMELINE] "+
    " ,[SUPPORT_TICKET_DATE_CREATED] "+
    " ,[SUPPORT_TICKET_RESOLUTION_TIME] "+
    " ,[SUPPORT_TICKET_STATUS_ID] "+
    " ,[TICKET_CATEGORY_ID] "+
    " ,[TICKET_SUB_CATEGORY_ID] "+
    " ,[TICKET_PRIORITY_ID] "+
    " ,[SUPPORT_AGENT_ID] "+
    " ,[RESOLUTION_DATE] "+
    " ,[END_USER_ID] "+
    " ,[SUPPORT_TICKET_ASSET_TAG] "+
    " ,[ROOM_NUMBER]) "+
    " VALUES "+
    " (@SUPPORT_TICKET_SUBJECT, "+
    " @SUPPORT_TICKET_NOTE, "+
    " @DEVICE_MAKE, "+
    " @DEVICE_MODEL, "+
    " @SUPPORT_TICKET_TIMELINE, "+
    " @SUPPORT_TICKET_DATE_CREATED, "+
    " @SUPPORT_TICKET_RESOLUTION_TIME, "+
    " @SUPPORT_TICKET_STATUS_ID, "+
    " @TICKET_CATEGORY_ID, "+
    " @TICKET_SUB_CATEGORY_ID, "+
    " @TICKET_PRIORITY_ID, "+
    " @SUPPORT_AGENT_ID, "+
    " @RESOLUTION_DATE, "+
    " @END_USER_ID, "+
    " @SUPPORT_TICKET_ASSET_TAG," +
    " @ROOM_NUMBER)"

    const insertSuppTicket = await pool.request()
                        .input('SUPPORT_TICKET_SUBJECT', sql.NVarChar(500), supportTicketData.SUPPORT_TICKET_SUBJECT)
                        .input('SUPPORT_TICKET_NOTE', sql.NVarChar('max'), supportTicketData.SUPPORT_TICKET_NOTE)
                        .input('DEVICE_MAKE', sql.NVarChar(20), supportTicketData.DEVICE_MAKE)
                        .input('DEVICE_MODEL', sql.NVarChar(20), supportTicketData.DEVICE_MODEL)
                        .input('SUPPORT_TICKET_TIMELINE', sql.NVarChar(20), supportTicketData.SUPPORT_TICKET_TIMELINE)
                        .input('SUPPORT_TICKET_DATE_CREATED', sql.DateTime, supportTicketData.SUPPORT_TICKET_DATE_CREATED)
                        .input('SUPPORT_TICKET_RESOLUTION_TIME', sql.Int, supportTicketData.SUPPORT_TICKET_RESOLUTION_TIME)
                        .input('SUPPORT_TICKET_STATUS_ID', sql.SmallInt, supportTicketData.SUPPORT_TICKET_STATUS_ID)
                        .input('TICKET_CATEGORY_ID', sql.SmallInt, supportTicketData.TICKET_CATEGORY_ID)
                        .input('TICKET_SUB_CATEGORY_ID', sql.SmallInt, supportTicketData.TICKET_SUB_CATEGORY_ID)        
                        .input('TICKET_PRIORITY_ID', sql.SmallInt, supportTicketData.TICKET_PRIORITY_ID)        
                        .input('SUPPORT_AGENT_ID', sql.SmallInt, supportTicketData.SUPPORT_AGENT_ID)        
                        .input('RESOLUTION_DATE', sql.DateTime, supportTicketData.RESOLUTION_DATE)  
                        .input('END_USER_ID', sql.SmallInt, supportTicketData.END_USER_ID)
                        .input('SUPPORT_TICKET_ASSET_TAG', sql.NVarChar(40), supportTicketData.SUPPORT_TICKET_ASSET_TAG)      
                        .input('ROOM_NUMBER', sql.NVarChar(40), supportTicketData.ROOM_NUMBER)      
                        .query(createSupportTicket);                            
    return insertSuppTicket.recordset;
}

const update = async (SUPPORT_TICKET_ID, data) => {
    try {
        let pool = await sql.connect(config.sql);
        const updateSubCatQ = "UPDATE [dbo].[SUPPORT_TICKET] "+
        " SET [SUPPORT_TICKET_SUBJECT] = @SUPPORT_TICKET_SUBJECT, "+
        " [SUPPORT_TICKET_NOTE] = @SUPPORT_TICKET_NOTE,  "+
        " [DEVICE_MAKE] = @DEVICE_MAKE,  "+
        " [DEVICE_MODEL] = @DEVICE_MODEL, "+
        " [SUPPORT_TICKET_TIMELINE] = @SUPPORT_TICKET_TIMELINE, "+
        " [SUPPORT_TICKET_RESOLUTION_TIME] = @SUPPORT_TICKET_RESOLUTION_TIME, "+
        " [SUPPORT_TICKET_STATUS_ID] = @SUPPORT_TICKET_STATUS_ID, "+
        " [SUPPORT_TICKET_ASSET_TAG] = @SUPPORT_TICKET_ASSET_TAG, "+
        " [TICKET_CATEGORY_ID] = @TICKET_CATEGORY_ID, "+
        " [TICKET_SUB_CATEGORY_ID] = @TICKET_SUB_CATEGORY_ID,  "+
        " [TICKET_PRIORITY_ID] = @TICKET_PRIORITY_ID, "+
        " [SUPPORT_AGENT_ID] = @SUPPORT_AGENT_ID,  "+
        " [RESOLUTION_DATE] = @RESOLUTION_DATE, "+
        " [ROOM_NUMBER] = @ROOM_NUMBER, "+
        " [END_USER_ID] = @END_USER_ID " +
        " WHERE SUPPORT_TICKET_ID=@SUPPORT_TICKET_ID"
     
        const update = await pool.request()
            .input('SUPPORT_TICKET_ID', sql.Int, SUPPORT_TICKET_ID)
            .input('SUPPORT_TICKET_SUBJECT', sql.NVarChar(500), data.SUPPORT_TICKET_SUBJECT)
            .input('SUPPORT_TICKET_NOTE', sql.NVarChar('max'), data.SUPPORT_TICKET_NOTE)
            .input('DEVICE_MAKE', sql.NVarChar(20), data.DEVICE_MAKE)
            .input('DEVICE_MODEL', sql.NVarChar(20), data.DEVICE_MODEL)
            .input('SUPPORT_TICKET_TIMELINE', sql.NVarChar(20), data.SUPPORT_TICKET_TIMELINE)
            .input('SUPPORT_TICKET_RESOLUTION_TIME', sql.Int, data.SUPPORT_TICKET_RESOLUTION_TIME)
            .input('SUPPORT_TICKET_STATUS_ID', sql.SmallInt, data.SUPPORT_TICKET_STATUS_ID)
            .input('SUPPORT_TICKET_ASSET_TAG', sql.NVarChar(40), data.SUPPORT_TICKET_ASSET_TAG)      
            .input('TICKET_CATEGORY_ID', sql.SmallInt, data.TICKET_CATEGORY_ID)
            .input('TICKET_SUB_CATEGORY_ID', sql.SmallInt, data.TICKET_SUB_CATEGORY_ID)        
            .input('TICKET_PRIORITY_ID', sql.SmallInt, data.TICKET_PRIORITY_ID)        
            .input('SUPPORT_AGENT_ID', sql.SmallInt, data.SUPPORT_AGENT_ID)        
            .input('RESOLUTION_DATE', sql.Date, data.RESOLUTION_DATE)
            .input('ROOM_NUMBER', sql.NVarChar(40), data.ROOM_NUMBER)
            .input('END_USER_ID', sql.SmallInt, data.END_USER_ID)        
                                
            .query(updateSubCatQ);
        return update.recordset;
    } catch (error) {
        return error.message;
    }
}

const del = async (SUPPORT_TICKET_ID) => {
    try {
        let pool = await sql.connect(config.sql);
        const deleteSuppTicketQ = "DELETE FROM SUPPORT_TICKET WHERE SUPPORT_TICKET_ID = @SUPPORT_TICKET_ID"

        const deleteSticket = await pool.request()
                        .input('SUPPORT_TICKET_ID', sql.Int, SUPPORT_TICKET_ID)
                            .query(deleteSuppTicketQ);
        return deleteSticket.recordset;
    } catch (error) {
        return error.message;
    }
}


module.exports = {
   GetAll,
   GetAllJoin,
   GetAssignedByUserId,
   getById,
   getByIdJoin,
   getTicketCountByCat,
   getTicketCountByCatPerUser,
   getTicketCountPerSupport,
   getResolvedTicketCountPerMonth,
   getTop5TicketPerUser,
   update,
   insertNew,
   del
}