const express = require('express');
const router = express.Router();
const urlController = require("../Controller/urlController")



router.post("/url/shorten",urlController.createUrl)

//API for wrong route-Of-API
router.all("/**", function (req, res) {
    res.status(404).send({
        status: false,
        message: "The api you request is not available"
    })
})
module.exports = router;