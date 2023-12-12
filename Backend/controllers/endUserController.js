'use strict';

const bcrypt = require('bcrypt');
const endUserData = require('../data/endusers');
const config = require('../config');
const sql = require('mssql');

const getAllEndUsers= async (req, res, next) => {
    try {

        const endUsersList = await endUserData.getEndUsers();
        res.send(endUsersList);        
    } catch (error) {
        res.status(400).send(error.message);
    }
}



const getEndUser = async (req, res, next) => {
    try {
        const END_USER_ID = req.params.id;
        const enduser = await endUserData.getById(END_USER_ID);
        res.send(enduser);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const addEndUser = async (req, res, next) => {
    try {
        const data = req.body;
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(data.END_USER_PASSWORD, saltRounds);
        data.END_USER_PASSWORD = hashedPassword;
        const insert = await endUserData.createEndUser(data);
        res.send({END_USER_ID: insert});
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const loginEndUser = async (req, res, next) => {
    try {
        const { END_USER_EMAIL, END_USER_PASSWORD } = req.body;

        const pool = await sql.connect(config.sql);

        const result = await pool.request()
            .input('END_USER_EMAIL', sql.NVarChar, END_USER_EMAIL)
            .query("SELECT END_USER_ID, END_USER_FIRST_NAME, END_USER_EMAIL, USER_ROLE_NAME, ACTIVE_STATUS_ID " +
                "FROM [dbo].[END_USER] as es " +
                "JOIN [dbo].[USER_ROLE] as ur ON es.USER_ROLE_ID = ur.USER_ROLE_ID " +
                "WHERE END_USER_EMAIL=@END_USER_EMAIL");

        await pool.close();

        if (result.recordset.length === 0) {
            return res.status(401).json({ message: 'User not found' });
        }

        const user = result.recordset[0];
        const storedHashedPassword = await endUserData.getHashedPassword(END_USER_EMAIL);

        const passwordMatch = await bcrypt.compare(END_USER_PASSWORD, storedHashedPassword);

        if (passwordMatch) {
            const userData = {
                END_USER_ID: user.END_USER_ID,
                END_USER_FIRST_NAME: user.END_USER_FIRST_NAME,
                END_USER_EMAIL: user.END_USER_EMAIL,
                USER_ROLE_NAME: user.USER_ROLE_NAME,
                ACTIVE_STATUS_ID: user.ACTIVE_STATUS_ID,
            };

            return res.status(200).send(userData);
        } else {
            res.status(401).json({ message: 'Login Failed' });
        }
    } catch (error) {
        console.error('Error in loginEndUser:', error);
        return res.status(400).json({ message: 'An error occurred during login' });
    }
}

const updateEndUser = async (req, res, next) => {
    try {
        const END_USER_ID =  req.params.id;
        const data = req.body;
        const updated = await endUserData.updateEndUser(END_USER_ID, data);
        res.send(updated);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const updateEndUserPassword = async (req, res, next) => {
    try {
        const data = req.body;
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(data.END_USER_PASSWORD, saltRounds);
        data.END_USER_PASSWORD = hashedPassword;
        const update = await endUserData.updateEndUserPass(data);
        res.send(update);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

/** */
const deleteEndUser = async (req, res, next) => {
    try {
        const END_USER_ID = req.params.id;
        const deleteEndUser = await endUserData.deleteEndUser(END_USER_ID);
        res.send(deleteEndUser);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

module.exports = {
    getAllEndUsers,
    getEndUser,
    addEndUser,
    loginEndUser,
    updateEndUser,
    updateEndUserPassword,
    deleteEndUser,
}