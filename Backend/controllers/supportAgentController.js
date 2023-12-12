'use strict';

const supportAgentData = require('../data/supportAgents');

const getAllSupportAgents = async (req, res, next) => {
    try {

        const supportAgentsList = await supportAgentData.getSupportAgents();
        res.send(supportAgentsList);        
        console.log(supportAgentsList)
    } catch (error) {
        res.status(400).send(error.message);
    }
}



const getSingleSupportAgent = async (req, res, next) => {
    try {
        const SUPPORT_AGENT_ID = req.params.id;
        const supportagent = await supportAgentData.getSingleSupportAgent(SUPPORT_AGENT_ID);
        res.send(supportagent);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const addSupportAgent = async (req, res, next) => {
    try {
        const data = req.body;
        const insert = await supportAgentData.createSupportAgent(data);
        res.send(insert);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const updateSupportAgent = async (req, res, next) => {
    try {
        const SUPPORT_AGENT_ID =  req.params.id;
        const data = req.body;
        const updated = await supportAgentData.updateSupportAgent(SUPPORT_AGENT_ID, data);
        res.send(updated);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

/** */
const deleteSupportAgent = async (req, res, next) => {
    try {
        const SUPPORT_AGENT_ID = req.params.id;
        const deleteSupportAgent = await supportAgentData.deleteSupportAgent(SUPPORT_AGENT_ID);
        res.send(deleteSupportAgent);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

module.exports = {
    getAllSupportAgents,
    getSingleSupportAgent,
    addSupportAgent,
    updateSupportAgent,
    deleteSupportAgent
}