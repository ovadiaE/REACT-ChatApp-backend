const express = require('express')
const cors = require('cors')
const router = express.Router();

router.get('/', cors(), (req, res) => {
    res.send({response:"Eureka"}).status(200)
});

module.exports = router