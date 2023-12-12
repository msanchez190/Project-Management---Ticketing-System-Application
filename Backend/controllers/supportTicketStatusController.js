'use strict';

const ticketStatusData = require('../data/supportTicketStatusses');

const getAllTicketStatus = async (req, res, next) => {
    try {

        const ticketStatusList = await ticketStatusData.getAll();
        res.send(ticketStatusList);        
        console.log(ticketStatusList)
    } catch (error) {
        res.status(400).send(error.message);
    }
}


const getActiveTicketStatus = async (req, res, next) => {
    try {

        const ticketStatusList = await ticketStatusData.getActiveTicketStatusses();
        res.send(ticketStatusList);        
        console.log(ticketStatusList)
    } catch (error) {
        res.status(400).send(error.message);
    }
}



const getSingleTicketStatus = async (req, res, next) => {
    try {
        const SUPPORT_TICKET_STATUS_ID = req.params.id;
        const ticketstatus = await ticketStatusData.getById(SUPPORT_TICKET_STATUS_ID);
        res.send(ticketstatus);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const addTicketStatus = async (req, res, next) => {
    try {
        const data = req.body;
        const insert = await ticketStatusData.createTicketStatus(data);
        res.send(insert);
    } catch (error) {
        res.status(400).send(error.message);
    }
}
/**
const updaTicketStatus = async (req, res, next) => {
    try {
        const SUPPORT_TICKET_STATUS_ID =  req.params.id;
        const data = req.body;
        const updated = await ticketStatusData.updateTicketStatus(SUPPORT_TICKET_STATUS_ID, data);
        res.send(updated);
    } catch (error) {
        res.status(400).send(error.message);
    }
}
*/

const updateTicketStatus = async (req, res, next) => {
    try {
        const SUPPORT_TICKET_STATUS_ID =  req.params.id;
        const data = req.body;
        const updated = await ticketStatusData.updateTicketStatus(SUPPORT_TICKET_STATUS_ID, data);
        res.send(updated);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

/** */
const deleteTicketStatus = async (req, res, next) => {
    try {
        const SUPPORT_TICKET_STATUS_ID = req.params.id;
        const deleteticketstatus = await ticketStatusData.deleteTicketStatus(SUPPORT_TICKET_STATUS_ID);
        res.send(deleteticketstatus);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

module.exports = {
    getAllTicketStatus,
    getActiveTicketStatus,
    getSingleTicketStatus,
    addTicketStatus,
    updateTicketStatus,
    deleteTicketStatus
}