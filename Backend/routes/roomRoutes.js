'use strict';

const express = require('express');
const roomController = require('../controllers/roomController');

const router = express.Router();
router.get('/room', roomController.GetAllRooms);


module.exports = {
    routes: router
}