"use strict";

const subCategoryData = require("../data/subCategories");

const getAllSubCategories = async (req, res, next) => {
  try {
    const subCategoryList = await subCategoryData.GetAll();
    res.send(subCategoryList);
    console.log(subCategoryList);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getActiveSubCat = async (req, res, next) => {
  try {
    const subCategoryList = await subCategoryData.GetActive();
    res.send(subCategoryList);
    console.log(subCategoryList);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getSubCagtbyType = async (req, res, next) => {
  try {
    const TICKET_CATEGORY_ID = req.params.id;
    const subcategory = await subCategoryData.getByType(TICKET_CATEGORY_ID);
    res.send(subcategory);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getSubCagtbyId = async (req, res, next) => {
  try {
    const TICKET_SUB_CATEGORY_ID = req.params.id;
    const subcategory = await subCategoryData.getById(TICKET_SUB_CATEGORY_ID);
    res.send(subcategory);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const addSubCat = async (req, res, next) => {
  try {
    const data = req.body;
    const insert = await subCategoryData.insertNew(data);
    res.send(insert);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const updateSubCat = async (req, res, next) => {
  try {
    const TICKET_SUB_CATEGORY_ID = req.params.id;
    const data = req.body;
    const updated = await subCategoryData.update(TICKET_SUB_CATEGORY_ID, data);
    res.send(updated);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

/** */
const deleteSubCat = async (req, res, next) => {
  try {
    const subCatData = req.params.id;
    const deleteSubCatefory = await subCategoryData.del(subCatData);
    res.send(deleteSubCatefory);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = {
  getAllSubCategories,
  getSubCagtbyId,
  getActiveSubCat,
  getSubCagtbyType,
  addSubCat,
  updateSubCat,
  deleteSubCat,
};
