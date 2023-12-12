'use strict';
const utils = require('../utils');
const config = require('../../config');
const sql = require('mssql');


const getSupportRoles = async () => {
    try {
        let pool = await sql.connect(config.sql);
        const selectAllSupportRolesQuery = "SELECT [SUPPORT_ROLE_ID] " +
        " ,[SUPPORT_ROLE_DESC] ,[ACTIVE_STATUS_ID] FROM [dbo].[SUPPORT_ROLE]"
        const supportRolesList = await pool.request().query(selectAllSupportRolesQuery);
        return supportRolesList.recordset;
    } catch (error) {
        console.log(error.message);
    }
}

const getActiveSuppRoles = async () => {
    try {
        let pool = await sql.connect(config.sql);
        const getActiveSupportRQuery = "SELECT dbo.SUPPORT_ROLE.SUPPORT_ROLE_ID, dbo.SUPPORT_ROLE.SUPPORT_ROLE_DESC, dbo.ACTIVE_STATUS.ACTIVE_STATUS_DESC " +
        " FROM dbo.ACTIVE_STATUS INNER JOIN  dbo.SUPPORT_ROLE ON dbo.ACTIVE_STATUS.ACTIVE_STATUS_ID = dbo.SUPPORT_ROLE.ACTIVE_STATUS_ID" +
         " WHERE ACTIVE_STATUS.ACTIVE_STATUS_DESC = 'ACTIVE'"
        const supportRolesList = await pool.request().query(getActiveSupportRQuery);
        return supportRolesList.recordset;
    } catch (error) {
        console.log(error.message);
    }
}

const getById = async(SUPPORT_ROLE_ID) => {
    try {
        let pool = await sql.connect(config.sql);
        const supportRoleByIdQuery = "SELECT [SUPPORT_ROLE_ID] " +
        " ,[SUPPORT_ROLE_DESC] ,[ACTIVE_STATUS_ID] FROM [dbo].[SUPPORT_ROLE] WHERE SUPPORT_ROLE_ID=@SUPPORT_ROLE_ID"
      
        const supportRole = await pool.request()
                            .input('SUPPORT_ROLE_ID', sql.Int, SUPPORT_ROLE_ID)
                            .query(supportRoleByIdQuery);
        return supportRole.recordset;
    } catch (error) {
        return error.message;
    }
}

const getByStatus = async(SUPPORT_ROLE_DESC) => {
    try {
        let pool = await sql.connect(config.sql);
        const supportRoleByStatusQuery = "SELECT [SUPPORT_ROLE_ID] " +
        " ,[SUPPORT_ROLE_DESC] FROM [dbo].[SUPPORT_ROLE] WHERE SUPPORT_ROLE_DESC=@SUPPORT_ROLE_DESC"
      
        const supportRole = await pool.request()
                            .input('SUPPORT_ROLE_DESC', SUPPORT_ROLE_DESC)
                            .query(supportRoleByStatusQuery);
        return supportRole.recordset;
    } catch (error) {
        return error.message;
    }
}

const createSupportRole = async (supporRoleData) => {
    try {
        let pool = await sql.connect(config.sql);
        const createSupportRoleQuery = "INSERT INTO [dbo].[SUPPORT_ROLE] "
        +"   ([SUPPORT_ROLE_DESC]  ,[ACTIVE_STATUS_ID])  VALUES " +
        " (@SUPPORT_ROLE_DESC, @ACTIVE_STATUS_ID)"
        
        const inserSupportRole = await pool.request()
                            .input('SUPPORT_ROLE_DESC', sql.NVarChar(20), supporRoleData.SUPPORT_ROLE_DESC)
                            .input('ACTIVE_STATUS_ID', sql.SmallInt, supporRoleData.ACTIVE_STATUS_ID)
                          
                            .query(createSupportRoleQuery);                            
        return inserSupportRole.recordset;
    } catch (error) {
        return error.message;
    }
}

const updateSupportRole = async (SUPPORT_ROLE_ID, data) => {
    try {
        let pool = await sql.connect(config.sql);
        const updateSupportRoleQuery = "UPDATE [dbo].[SUPPORT_ROLE] "
        +" SET [SUPPORT_ROLE_DESC] = @SUPPORT_ROLE_DESC, [ACTIVE_STATUS_ID] = @ACTIVE_STATUS_ID "+
        "  WHERE SUPPORT_ROLE_ID = @SUPPORT_ROLE_ID";
     
        const update = await pool.request()
            .input('SUPPORT_ROLE_ID', sql.Int, SUPPORT_ROLE_ID)
            .input('SUPPORT_ROLE_DESC', sql.NVarChar(20), data.SUPPORT_ROLE_DESC)
            .input('ACTIVE_STATUS_ID', sql.SmallInt, data.ACTIVE_STATUS_ID)
            .query(updateSupportRoleQuery);
        return update.recordset;
    } catch (error) {
        return error.message;
    }
}

const deleteSupportRole = async (SUPPORT_ROLE_ID) => {
    try {
        let pool = await sql.connect(config.sql);
        const deleteSupportRoleQuery = "DELETE FROM SUPPORT_ROLE WHERE SUPPORT_ROLE_ID = @SUPPORT_ROLE_ID"

        const deleteSuppRole = await pool.request()
                        .input('SUPPORT_ROLE_ID', sql.Int, SUPPORT_ROLE_ID)
                            .query(deleteSupportRoleQuery);
        return deleteSuppRole.recordset;
    } catch (error) {
        return error.message;
    }
}


module.exports = {
    getSupportRoles,
    getActiveSuppRoles,
    getById,
    getByStatus,
    createSupportRole,
    updateSupportRole,
    deleteSupportRole
}