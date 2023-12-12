'use strict';

const express = require('express');
const categoryController = require('../controllers/categoryController');
const router = express.Router();
router.get('/categories',categoryController.getAllCategories);
router.get('/activecategories',categoryController.getActiveCategories);
router.get('/roles', categoryController.getAllRoles);
router.get('/category/:id', categoryController.getCategory);
router.post('/category', categoryController.addCategory);
router.put('/category/:id', categoryController.updateCategory);
router.delete('/category/:id', categoryController.deleteCategory);


module.exports = {
    routes: router
}