'use strict';
const utils = require('../utils');
const config = require('../../config');
const sql = require('mssql');

const getCategories = async () => {

    try {
        let pool = await sql.connect(config.sql);
        const getAllQuery = "SELECT dbo.TICKET_CATEGORY.TICKET_CATEGORY_ID, "+
        " dbo.TICKET_CATEGORY.TICKET_CATEGORY_DESC, dbo.ACTIVE_STATUS.ACTIVE_STATUS_DESC, dbo.TICKET_CATEGORY.ACTIVE_STATUS_ID "+
        " FROM  dbo.ACTIVE_STATUS INNER JOIN "+
        " dbo.TICKET_CATEGORY ON dbo.ACTIVE_STATUS.ACTIVE_STATUS_ID = dbo.TICKET_CATEGORY.ACTIVE_STATUS_ID "
        const categoriesList = await pool.request().query(getAllQuery);
        return categoriesList.recordset;
    } catch (error) {
        console.log(error.message);
    }
}

const getAllRoles = async () => {

    try {
        let pool = await sql.connect(config.sql);
        const getQuery = "SELECT * FROM dbo.USER_ROLE"
        const roleList = await pool.request().query(getQuery);
        return roleList.recordset;
    } catch (error) {
        console.log(error.message)
    } 
}

const getActiveCategories = async () => {
    try {
        let pool = await sql.connect(config.sql);
        const getActiveCategoriesQuery = "SELECT TICKET_CATEGORY.TICKET_CATEGORY_ID, TICKET_CATEGORY.TICKET_CATEGORY_DESC," +
            "ACTIVE_STATUS.ACTIVE_STATUS_DESC FROM  ACTIVE_STATUS  INNER JOIN TICKET_CATEGORY ON ACTIVE_STATUS.ACTIVE_STATUS_ID = " +
            "TICKET_CATEGORY.ACTIVE_STATUS_ID WHERE ACTIVE_STATUS_DESC = 'ACTIVE'";

        const categoriesList = await pool.request().query(getActiveCategoriesQuery);

        return categoriesList.recordset;
    } catch (error) {
        console.log(error.message);
    }
}

const getById = async (TICKET_CATEGORY_ID) => {
    try {
        let pool = await sql.connect(config.sql);
        const catByIdQuery = "SELECT TICKET_CATEGORY.TICKET_CATEGORY_ID, TICKET_CATEGORY.TICKET_CATEGORY_DESC, " +
            " ACTIVE_STATUS.ACTIVE_STATUS_DESC FROM  ACTIVE_STATUS  INNER JOIN TICKET_CATEGORY ON ACTIVE_STATUS.ACTIVE_STATUS_ID " +
            " = TICKET_CATEGORY.ACTIVE_STATUS_ID WHERE TICKET_CATEGORY_ID = @TICKET_CATEGORY_ID";
        const category = await pool.request()
            .input('TICKET_CATEGORY_ID', sql.Int, TICKET_CATEGORY_ID)
            .query(catByIdQuery);
        return category.recordset;
    } catch (error) {
        return error.message;
    }
}

const createCategory = async (catData) => {
    try {
        let pool = await sql.connect(config.sql);
        const createCatQuery = "INSERT INTO [dbo].[TICKET_CATEGORY]" +
            " ([TICKET_CATEGORY_DESC]  ,[ACTIVE_STATUS_ID])  VALUES " +
            " (@TICKET_CATEGORY_DESC,    @ACTIVE_STATUS_ID)";
        const insertEvent = await pool.request()
            .input('TICKET_CATEGORY_DESC', sql.NVarChar(20), catData.TICKET_CATEGORY_DESC)
            .input('ACTIVE_STATUS_ID', sql.SmallInt, catData.ACTIVE_STATUS_ID)
            .query(createCatQuery);
        return insertEvent.recordset;
    } catch (error) {
        return error.message;
    }
}

const updateCategory = async (TICKET_CATEGORY_ID, data) => {
    try {
        let pool = await sql.connect(config.sql);
        const updateCatQuery = "UPDATE [TICKET_CATEGORY] SET " +
            " [TICKET_CATEGORY_DESC] = @TICKET_CATEGORY_DESC, [ACTIVE_STATUS_ID] = @ACTIVE_STATUS_ID " +
            " WHERE [TICKET_CATEGORY_ID]=@TICKET_CATEGORY_ID"
        const update = await pool.request()
            .input('TICKET_CATEGORY_ID', sql.Int, TICKET_CATEGORY_ID)
            .input('TICKET_CATEGORY_DESC', sql.NVarChar(30), data.TICKET_CATEGORY_DESC)
            .input('ACTIVE_STATUS_ID', sql.SmallInt, data.ACTIVE_STATUS_ID)
            .query(updateCatQuery);
        return update.recordset;
    } catch (error) {
        return error.message;
    }
}

const deleteCategory = async (TICKET_CATEGORY_ID) => {
    try {
        let pool = await sql.connect(config.sql);
        const deleteCatQuery = "DELETE FROM [TICKET_CATEGORY] WHERE [TICKET_CATEGORY_ID]=@TICKET_CATEGORY_ID"
        const deleteCategory = await pool.request()
            .input('TICKET_CATEGORY_ID', sql.Int, TICKET_CATEGORY_ID)
            .query(deleteCatQuery);
        return deleteCategory.recordset;
    } catch (error) {
        return error.message;
    }
}


module.exports = {
    getCategories,
    getById,
    createCategory,
    updateCategory,
    getActiveCategories,
    deleteCategory,
    getAllRoles
}