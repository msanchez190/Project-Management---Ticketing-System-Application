'use strict';

const supportTicketData = require('../data/supportTickets');

const GetAllSupportTickets = async (req, res, next) => {
    try {

        const ticketLIst = await supportTicketData.GetAll();
        res.send(ticketLIst);        
        console.log(ticketLIst)
    } catch (error) {
        res.status(400).send(error.message);
    }
}


const GetAllTicketsDisplay = async (req, res, next) => {
    try {
        const userRole = req.body.userRole;
        const userId = req.body.userId;
        const SUPPORT_TICKET_STATUS = req.body.status;
        const createdByUserId = req.body.createdByUserId;
        const assignedToMe = req.body.assignedToMe;
        const SEARCH_TERM = req.body.searchTerm;

        let ticketList = [];
        if ((userRole === 'System Administrator' || userRole === 'IT Teacher') && !assignedToMe) {
            // get all tickets
            ticketList = await supportTicketData.GetAllJoin({
                USER_ID: createdByUserId, 
                SUPPORT_TICKET_STATUS,
                SEARCH_TERM,
            });
        } else {
            // only get tickets created by the current user
            ticketList = await supportTicketData.GetAllJoin({
                USER_ID: userId,
                SUPPORT_TICKET_STATUS,
                SEARCH_TERM
            });
        }
        
        res.send(ticketList);         
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const GetAllAssignedTicketsDisplay = async (req, res, next) => {
    try {
        const userId = req.body.userId;
        const SUPPORT_TICKET_STATUS = req.body.status;
        const SEARCH_TERM = req.body.searchTerm;

        const ticketList = await supportTicketData.GetAssignedByUserId({ USER_ID: userId, SUPPORT_TICKET_STATUS, SEARCH_TERM });
        res.send(ticketList);         
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getSingleTicket = async (req, res, next) => {
    try {
        const SUPPORT_TICKET_ID = req.params.id;
        const supportTicket = await supportTicketData.getById(SUPPORT_TICKET_ID);
        res.send(supportTicket);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const supportTicketByCat = async (req, res, next) => {
    try {
        const countTickets = await supportTicketData.getTicketCountByCat();
        res.send(countTickets);
        console.log(countTickets);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const supportTicketByCatPerUser = async (req, res, next) => {
    try {
        const END_USER_ID = req.params.id;
        const ticketsPerUser = await supportTicketData.getTicketCountByCatPerUser(END_USER_ID);
        res.send(ticketsPerUser);
        console.log(ticketsPerUser);
    } catch (error) {
        res.status(400).send(error.message)
    }
}

const recentTicketsPerUser = async (req, res, next) => {
    try {
        const END_USER_ID = req.params.id;
        const recentTickets = await supportTicketData.getTop5TicketPerUser(END_USER_ID)
        res.send(recentTickets);
        console.log(recentTickets);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const supportTicketPerSupport = async (req, res, next) => {
    try {
        const ticketsPerSupport = await supportTicketData.getTicketCountPerSupport();
        res.send(ticketsPerSupport);
        console.log(ticketsPerSupport);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const ticketsClosedCount = async (req, res, next) => {
    try {
        const closedTickets = await supportTicketData.getResolvedTicketCountPerMonth();
        res.send(closedTickets);
        console.log(closedTickets);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const insertSupportTicket = async (req, res, next) => {
    try {
        const data = req.body;
        const insert = await supportTicketData.insertNew(data);
        res.send(insert);
    } catch (error) {
        res.status(400).send(error.message);
    }
}


const updateSupportTicket = async (req, res, next) => {
    try {
        const SUPPORT_TICKET_ID =  req.params.id;
        const data = req.body;
        const updated = await supportTicketData.update(SUPPORT_TICKET_ID, data);
        res.send(updated);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

/** */
const delSupportTicket = async (req, res, next) => {
    try {
        const SUPPORT_TICKET_ID = req.params.id;
        const deleteSupportTicket = await supportTicketData.del(SUPPORT_TICKET_ID);
        res.send(deleteSupportTicket);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

module.exports = {
   GetAllSupportTickets,
   GetAllTicketsDisplay,
   GetAllAssignedTicketsDisplay,
   getSingleTicket,
   supportTicketByCat,
   recentTicketsPerUser,
   supportTicketByCatPerUser,
   supportTicketPerSupport,
   ticketsClosedCount,
   insertSupportTicket,
   updateSupportTicket,
   delSupportTicket
}