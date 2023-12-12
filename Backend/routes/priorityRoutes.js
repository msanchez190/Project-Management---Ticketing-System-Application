'use strict';

const express = require('express');
const priorityControl = require('../controllers/priorityController');
const router = express.Router();
router.get('/priorities',priorityControl.getAllPriorities);
router.get('/activepriorities',priorityControl.getActivePriorities);
router.get('/priority/:id', priorityControl.getPriority);

router.post('/priority', priorityControl.addPriority);
router.put('/priority/:id', priorityControl.updatePriority);
router.delete('/priority/:id', priorityControl.deletePriority);


module.exports = {
    routes: router
}