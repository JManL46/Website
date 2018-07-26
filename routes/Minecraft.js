const express = require('express');
const router = express.Router();
const request = require('request');

router.get('/', async(req, res, next) => {
    try {
        return res.render('minecraft', { title: 'Orion-Entertainment - Minecraft' });
    } catch (error) {
        return res.render('error', { error: error });
    }
});

module.exports = router;