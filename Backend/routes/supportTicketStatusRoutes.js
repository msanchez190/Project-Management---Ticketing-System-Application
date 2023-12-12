'use strict';

const express = require('express');
const ticketStatusContr  = require('../controllers/supportTicketStatusController');
const router = express.Router();
router.get('/ticketstatuses', ticketStatusContr.getAllTicketStatus);
router.get('/activeticketstatuses', ticketStatusContr.getActiveTicketStatus);
router.get('/ticketstatus/:id', ticketStatusContr.getSingleTicketStatus);

router.post('/ticketstatus', ticketStatusContr.addTicketStatus);
router.put('/ticketstatus/:id', ticketStatusContr.updateTicketStatus);
router.delete('/ticketstatus/:id', ticketStatusContr.deleteTicketStatus);


module.exports = {
    routes: router
}