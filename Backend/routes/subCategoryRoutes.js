'use strict';

const express = require('express');
const subCatContr = require('../controllers/subCategoryController');
const router = express.Router();
router.get('/subcategories',subCatContr.getAllSubCategories);
router.get('/activesubcategories',subCatContr.getActiveSubCat);
router.get('/subcattype/:id', subCatContr.getSubCagtbyType);
router.get('/subcategory/:id', subCatContr.getSubCagtbyId);
router.post('/subcategory', subCatContr.addSubCat);
router.put('/subcategory/:id', subCatContr.updateSubCat);
router.delete('/subcategory/:id', subCatContr.deleteSubCat);



module.exports = {
    routes: router
}