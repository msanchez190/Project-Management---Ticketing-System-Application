'use strict';
const utils = require('../utils');
const config = require('../../config');
const sql = require('mssql');


const getSupportAgents = async () => {
    try {
        let pool = await sql.connect(config.sql);
        const getSupportAgentQ =  "SELECT SUPPORT_AGENT_USER_ID, " +
        "eu.END_USER_ID, " +
        "eu.END_USER_EMAIL, " +
        "CONCAT(END_USER_FIRST_NAME, ' ', END_USER_LAST_NAME) AS SUPPORT_AGENT "+
        "FROM dbo.SUPPORT_AGENT_USER AS SAU "+
        "JOIN dbo.END_USER as EU "+
        "ON SAU.END_USER_ID = EU.END_USER_ID ";
        const supportAgentList = await pool.request().query(getSupportAgentQ);
        return supportAgentList.recordset;
    } catch (error) {
        console.log(error.message);
    }
}



const getSingleSupportAgent = async(SUPPORT_AGENT_ID) => {
    try {
        let pool = await sql.connect(config.sql);
        const getSupportAgentQ = "SELECT [SUPPORT_AGENT_ID] ,[SUPPORT_AGENT_FIRST_NAME] "+
        " ,[SUPPORT_AGENT_LAST_NAME] ,[SUPPORT_AGENT_EMAIL] ,[SUPPORT_AGENT_PRIMARY_PHONE] "+
        " FROM [dbo].[SUPPORT_AGENT] WHERE SUPPORT_AGENT_ID = @SUPPORT_AGENT_ID"
      
        const supportagent = await pool.request()
                            .input('SUPPORT_AGENT_ID', sql.Int, SUPPORT_AGENT_ID)
                            .query(getSupportAgentQ);
        return supportagent.recordset;
    } catch (error) {
        return error.message;
    }
}

const createSupportAgent = async (data) => {
    try {
        let pool = await sql.connect(config.sql);
        const insertSupportAgentQ = "INSERT INTO [dbo].[SUPPORT_AGENT_USER] ([END_USER_ID]) VALUES "+
        " (@END_USER_ID)"
        
        const insertSupportAgent = await pool.request()
                            .input('END_USER_ID', sql.SmallInt, data.END_USER_ID)
                            .query(insertSupportAgentQ);                            
        return insertSupportAgent.recordset;
    } catch (error) {
        return error.message;
    }
}

const updateSupportAgent = async (SUPPORT_AGENT_ID, data) => {
    try {
        let pool = await sql.connect(config.sql);
        const updateSupportAgentQ = "UPDATE [dbo].[SUPPORT_AGENT] SET [SUPPORT_AGENT_FIRST_NAME] "
        +" = @SUPPORT_AGENT_FIRST_NAME, [SUPPORT_AGENT_LAST_NAME] = @SUPPORT_AGENT_LAST_NAME "+
         "  ,[SUPPORT_AGENT_EMAIL] = @SUPPORT_AGENT_EMAIL ,[SUPPORT_AGENT_PRIMARY_PHONE] "+
         " = @SUPPORT_AGENT_PRIMARY_PHONE  WHERE SUPPORT_AGENT_ID =@SUPPORT_AGENT_ID"
     
        const update = await pool.request()
            .input('SUPPORT_AGENT_ID', sql.Int, SUPPORT_AGENT_ID)
            .input('SUPPORT_AGENT_FIRST_NAME', sql.NVarChar(40), data.SUPPORT_AGENT_FIRST_NAME)
            .input('SUPPORT_AGENT_LAST_NAME', sql.NVarChar(40), data.SUPPORT_AGENT_LAST_NAME)
            .input('SUPPORT_AGENT_EMAIL', sql.NVarChar(40), data.SUPPORT_AGENT_EMAIL)
             .input('SUPPORT_AGENT_PRIMARY_PHONE', sql.NVarChar(40), data.SUPPORT_AGENT_PRIMARY_PHONE)
            .query(updateSupportAgentQ);
        return update.recordset;
    } catch (error) {
        return error.message;
    }
}

const deleteSupportAgent = async (SUPPORT_AGENT_ID) => {
    try {
        let pool = await sql.connect(config.sql);
        const deleteSupportAgentQ = "DELETE FROM SUPPORT_AGENT WHERE SUPPORT_AGENT_ID = @SUPPORT_AGENT_ID"

        const deleteSupportAgent = await pool.request()
                        .input('SUPPORT_AGENT_ID', sql.Int, SUPPORT_AGENT_ID)
                            .query(deleteSupportAgentQ);
        return deleteSupportAgent.recordset;
    } catch (error) {
        return error.message;
    }
}


module.exports = {
    getSingleSupportAgent,
    getSupportAgents,
    createSupportAgent,
    updateSupportAgent,
    deleteSupportAgent
   
}