'use strict';

const categoryData = require('../data/categories');

const getAllCategories = async (req, res, next) => {
    try {

        const categorylist = await categoryData.getCategories();
        res.send(categorylist);        
        console.log(categorylist)
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getAllRoles = async (req, res, next) => {
    try {
        const roleList = await categoryData.getAllRoles();
        res.send(roleList)
        console.log(roleList)
    } catch (error) {
        res.status(400).send(error.message)
    }
}

const getActiveCategories = async (req, res, next) => {
    try {

        const categorylist = await categoryData.getActiveCategories();
        res.send(categorylist);        
        console.log(categorylist)
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getCategory = async (req, res, next) => {
    try {
        const TICKET_CATEGORY_ID = req.params.id;
        const category = await categoryData.getById(TICKET_CATEGORY_ID);
        res.send(category);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const addCategory = async (req, res, next) => {
    try {
        const data = req.body;
        const insert = await categoryData.createCategory(data);
        res.send(insert);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const updateCategory = async (req, res, next) => {
    try {
        const TICKET_CATEGORY_ID =  req.params.id;
        const data = req.body;
        const updated = await categoryData.updateCategory(TICKET_CATEGORY_ID, data);
        res.send(updated);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

/** */
const deleteCategory = async (req, res, next) => {
    try {
        const TICKET_CATEGORY_ID = req.params.id;
        const deletedCategory = await categoryData.deleteCategory(TICKET_CATEGORY_ID);
        res.send(deletedCategory);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

module.exports = {
    getAllCategories,
    getCategory,
    addCategory,
    updateCategory,
    getActiveCategories,
    deleteCategory,
    getAllRoles
}