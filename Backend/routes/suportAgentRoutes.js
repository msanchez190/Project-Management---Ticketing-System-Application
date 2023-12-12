'use strict';

const express = require('express');
const supportAgentContr  = require('../controllers/supportAgentController');
const router = express.Router();
router.get('/supportagents', supportAgentContr.getAllSupportAgents);
router.get('/supportagent/:id', supportAgentContr.getSingleSupportAgent);
router.post('/supportagent', supportAgentContr.addSupportAgent);
router.put('/supportagent/:id', supportAgentContr.updateSupportAgent);
router.delete('/supportagent/:id', supportAgentContr.deleteSupportAgent);


module.exports = {
    routes: router
}