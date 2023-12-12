'use strict';

const express = require('express');
const activeStatusCtr = require('../controllers/activeStatusController');
const router = express.Router();
router.get('/activestatusses',activeStatusCtr.getAllActiveStatusses);
router.get('/activestatus/:id',activeStatusCtr.getSingleActiveStatus);
router.get('/activeSingleStatus/:status',activeStatusCtr.getSingleActiveStatusByStatus);




module.exports = {
    routes: router
}