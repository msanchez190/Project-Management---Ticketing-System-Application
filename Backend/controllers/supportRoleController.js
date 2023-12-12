'use strict';

const supportRoleData = require('../data/supportRoles');

const getAllSupportRoles = async (req, res, next) => {
    try {

        const supportRoleList = await supportRoleData.getSupportRoles();
        res.send(supportRoleList);        
        console.log(supportRoleList)
    } catch (error) {
        res.status(400).send(error.message);
    }
}


const getActiveSupportRoles = async (req, res, next) => {
    try {

        const supportRoleList = await supportRoleData.getActiveSuppRoles();
        res.send(supportRoleList);        
        console.log(supportRoleList)
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getSupportRole = async (req, res, next) => {
    try {
        const SUPPORT_ROLE_ID = req.params.id;
        const supportRole = await supportRoleData.getById(SUPPORT_ROLE_ID);
        res.send(supportRole);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getSupportRoleByStatus = async (req, res, next) => {
    try {
        const SUPPORT_ROLE_DESC = req.params.status;
        const supportRole = await supportRoleData.getByStatus(SUPPORT_ROLE_DESC);
        res.send(supportRole);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const addSupportRole = async (req, res, next) => {
    try {
        const data = req.body;
        const insert = await supportRoleData.createSupportRole(data);
        res.send(insert);
    } catch (error) {
        res.status(400).send(error.message);
    }
}



const updateSupportRole = async (req, res, next) => {
    try {
        const SUPPORT_ROLE_ID =  req.params.id;
        const data = req.body;
        const updated = await supportRoleData.updateSupportRole(SUPPORT_ROLE_ID, data);
        res.send(updated);
    } catch (error) {
        res.status(400).send(error.message);
    }
}


const deleteSupportRole = async (req, res, next) => {
    try {
        const SUPPORT_ROLE_ID = req.params.id;
        const deletedSuppRole = await supportRoleData.deleteSupportRole(SUPPORT_ROLE_ID);
        res.send(deletedSuppRole);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

module.exports = {
   getAllSupportRoles,
   getSupportRole,
   getActiveSupportRoles,
   getSupportRoleByStatus,
   addSupportRole,
   updateSupportRole,
   deleteSupportRole
}