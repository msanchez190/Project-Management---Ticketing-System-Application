'use strict';

const express = require('express');
const suppRolesCont  = require('../controllers/supportRoleController');
const router = express.Router();
router.get('/supportroles',suppRolesCont.getActiveSupportRoles);
router.get('/activesupportroles',suppRolesCont.getActiveSupportRoles);
router.get('/supportrole/:id', suppRolesCont.getSupportRole);
router.get('/supportroleByStatus/:status', suppRolesCont.getSupportRoleByStatus)

router.post('/supportrole', suppRolesCont.addSupportRole);
router.put('/supportrole/:id', suppRolesCont.updateSupportRole);
router.delete('/supportrole/:id', suppRolesCont.deleteSupportRole);


module.exports = {
    routes: router
}