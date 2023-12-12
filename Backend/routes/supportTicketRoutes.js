'use strict';

const express = require('express');
const supportTicketCntr  = require('../controllers/supportTicketController');
const router = express.Router();
router.get('/supporttickets', supportTicketCntr.GetAllSupportTickets);
router.post('/ticketDisplay', supportTicketCntr.GetAllTicketsDisplay);
router.post('/assignedsupporttickets', supportTicketCntr.GetAllAssignedTicketsDisplay);
router.get('/ticketbycat', supportTicketCntr.supportTicketByCat);
router.get('/ticketbycat/:id', supportTicketCntr.supportTicketByCatPerUser);
router.get('/supportticket/:id', supportTicketCntr.getSingleTicket);
router.get('/ticketpersupport', supportTicketCntr.supportTicketPerSupport);
router.get('/ticketsclosedcountmonthly', supportTicketCntr.ticketsClosedCount);
router.get('/recentticketsperuser/:id', supportTicketCntr.recentTicketsPerUser);
router.post('/supportticket', supportTicketCntr.insertSupportTicket);
router.put('/supportticket/:id', supportTicketCntr.updateSupportTicket);
router.delete('/supportticket/:id', supportTicketCntr.delSupportTicket);


module.exports = {
    routes: router
}