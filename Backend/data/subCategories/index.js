"use strict";
const utils = require("../utils");
const config = require("../../config");
const sql = require("mssql");

const GetAll = async () => {
  try {
    let pool = await sql.connect(config.sql);
    const selectAllsubCategoriesQ =
      "SELECT " +
      " [TICKET_SUB_CATEGORY_ID] , [TICKET_SUB_CATEGORY_DESC] , " +
      " [TICKET_CATEGORY_ID]  ,[ACTIVE_STATUS_ID] FROM [TICKET_SUB_CATEGORY]";
    const subCategoryList = await pool.request().query(selectAllsubCategoriesQ);
    return subCategoryList.recordset;
  } catch (error) {
    console.log(error.message);
  }
};

const GetActive = async () => {
  try {
    let pool = await sql.connect(config.sql);
    const getActiveSubCategoriesQ =
      "SELECT TICKET_SUB_CATEGORY.TICKET_SUB_CATEGORY_ID, TICKET_SUB_CATEGORY.TICKET_SUB_CATEGORY_DESC, ACTIVE_STATUS.ACTIVE_STATUS_DESC " +
      " FROM ACTIVE_STATUS INNER JOIN TICKET_SUB_CATEGORY ON ACTIVE_STATUS.ACTIVE_STATUS_ID = TICKET_SUB_CATEGORY.ACTIVE_STATUS_ID " +
      " WHERE ACTIVE_STATUS.ACTIVE_STATUS_DESC = 'ACTIVE'";
    const subCategoryList = await pool.request().query(getActiveSubCategoriesQ);
    return subCategoryList.recordset;
  } catch (error) {
    console.log(error.message);
  }
};

const getByType = async (TICKET_CATEGORY_ID) => {
  try {
    let pool = await sql.connect(config.sql);
    const subCateQ =
      " SELECT  TICKET_SUB_CATEGORY.TICKET_SUB_CATEGORY_ID, TICKET_SUB_CATEGORY.TICKET_SUB_CATEGORY_DESC,TICKET_SUB_CATEGORY.TICKET_CATEGORY_ID, " +
      " TICKET_SUB_CATEGORY.ACTIVE_STATUS_ID, ACTIVE_STATUS.ACTIVE_STATUS_DESC FROM TICKET_SUB_CATEGORY INNER JOIN " +
      " ACTIVE_STATUS ON TICKET_SUB_CATEGORY.ACTIVE_STATUS_ID = ACTIVE_STATUS.ACTIVE_STATUS_ID " +
      " WHERE TICKET_CATEGORY_ID = @TICKET_CATEGORY_ID";
    const subCategory = await pool
      .request()
      .input("TICKET_CATEGORY_ID", sql.Int, TICKET_CATEGORY_ID)
      .query(subCateQ);
    return subCategory.recordset;
  } catch (error) {
    return error.message;
  }
};

const getById = async (TICKET_SUB_CATEGORY_ID) => {
  try {
    let pool = await sql.connect(config.sql);
    const subCateQ =
      "SELECT [TICKET_SUB_CATEGORY_ID] " +
      " ,[TICKET_SUB_CATEGORY_DESC] ,TICKET_CATEGORY_ID,[ACTIVE_STATUS_ID] FROM [dbo].[TICKET_SUB_CATEGORY]" +
      " WHERE TICKET_SUB_CATEGORY_ID = @TICKET_SUB_CATEGORY_ID";
    const subCategory = await pool
      .request()
      .input("TICKET_SUB_CATEGORY_ID", sql.Int, TICKET_SUB_CATEGORY_ID)
      .query(subCateQ);
    return subCategory.recordset;
  } catch (error) {
    return error.message;
  }
};

const insertNew = async (subCatData) => {
  try {
    let pool = await sql.connect(config.sql);
    const createSupportRoleQuery =
      "INSERT INTO [TICKET_SUB_CATEGORY] " +
      " ([TICKET_SUB_CATEGORY_DESC]  , [TICKET_CATEGORY_ID], [ACTIVE_STATUS_ID]) VALUES " +
      " (@TICKET_SUB_CATEGORY_DESC, @TICKET_CATEGORY_ID, @ACTIVE_STATUS_ID)";
    const insertSubCat = await pool
      .request()
      .input(
        "TICKET_SUB_CATEGORY_DESC",
        sql.NVarChar(30),
        subCatData.TICKET_SUB_CATEGORY_DESC
      )
      .input("TICKET_CATEGORY_ID", sql.SmallInt, subCatData.TICKET_CATEGORY_ID)
      .input("ACTIVE_STATUS_ID", sql.SmallInt, subCatData.ACTIVE_STATUS_ID)
      .query(createSupportRoleQuery);
    return insertSubCat.recordset;
  } catch (error) {
    return error.message;
  }
};

const update = async (TICKET_SUB_CATEGORY_ID, data) => {
  try {
    let pool = await sql.connect(config.sql);
    const updateSubCatQ =
      "UPDATE [dbo].[TICKET_SUB_CATEGORY] " +
      " SET [TICKET_SUB_CATEGORY_DESC] = @TICKET_SUB_CATEGORY_DESC, [ACTIVE_STATUS_ID] = @ACTIVE_STATUS_ID " +
      "  WHERE TICKET_SUB_CATEGORY_ID = @TICKET_SUB_CATEGORY_ID";

    const update = await pool
      .request()
      .input("TICKET_SUB_CATEGORY_ID", sql.Int, TICKET_SUB_CATEGORY_ID)
      .input(
        "TICKET_SUB_CATEGORY_DESC",
        sql.NVarChar(30),
        data.TICKET_SUB_CATEGORY_DESC
      )
      .input("ACTIVE_STATUS_ID", sql.SmallInt, data.ACTIVE_STATUS_ID)
      .query(updateSubCatQ);
    return update.recordset;
  } catch (error) {
    return error.message;
  }
};

const del = async (TICKET_SUB_CATEGORY_ID) => {
  try {
    let pool = await sql.connect(config.sql);
    const deleteSubCatQ =
      "DELETE FROM TICKET_SUB_CATEGORY WHERE TICKET_SUB_CATEGORY_ID = @TICKET_SUB_CATEGORY_ID";

    const deleteSubCat = await pool
      .request()
      .input("TICKET_SUB_CATEGORY_ID", sql.Int, TICKET_SUB_CATEGORY_ID)
      .query(deleteSubCatQ);
    return deleteSubCat.recordset;
  } catch (error) {
    return error.message;
  }
};

module.exports = {
  GetAll,
  GetActive,
  getByType,
  getById,
  update,
  insertNew,
  del,
};
