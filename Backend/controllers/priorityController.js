'use strict';

const priorityData = require('../data/priorities');

const getAllPriorities = async (req, res, next) => {
    try {

        const prioritylist = await priorityData.getPriorities();
        res.send(prioritylist);        
        console.log(prioritylist)
    } catch (error) {
        res.status(400).send(error.message);
    }
}


const getActivePriorities = async (req, res, next) => {
    try {

        const prioritylist = await priorityData.getActivePriorities();
        res.send(prioritylist);        
        console.log(prioritylist)
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getPriority = async (req, res, next) => {
    try {
        const PRIORITY_ID = req.params.id;
        const priority = await priorityData.getById(PRIORITY_ID);
        res.send(priority);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const addPriority = async (req, res, next) => {
    try {
        const data = req.body;
        const insert = await priorityData.createPriority(data);
        res.send(insert);
    } catch (error) {
        res.status(400).send(error.message);
    }
}



const updatePriority = async (req, res, next) => {
    try {
        const TICKET_PRIORITY_ID =  req.params.id;
        const data = req.body;
        const updated = await priorityData.updatePriority(TICKET_PRIORITY_ID, data);
        res.send(updated);
    } catch (error) {
        res.status(400).send(error.message);
    }
}


const deletePriority = async (req, res, next) => {
    try {
        const TICKET_PRIORITY_ID = req.params.id;
        const deletedPriority = await priorityData.deletePriority(TICKET_PRIORITY_ID);
        res.send(deletedPriority);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

module.exports = {
   getAllPriorities,
   getPriority,
   getActivePriorities,
   addPriority,
   updatePriority,
   deletePriority
}