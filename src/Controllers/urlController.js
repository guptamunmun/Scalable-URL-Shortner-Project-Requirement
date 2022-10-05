const axios = require("axios")
var shortId = require("shortid")
const urlModel = require("../models/urlModel")

const redis = require('redis')

const { promisify } = require("util");

const { isValid, isValidReqBody } = require('../validation/validators')

//==========================connect to redis===================================//
const redisClient = redis.createClient(
    15507, 
    "redis-15507.c301.ap-south-1-1.ec2.cloud.redislabs.com", 
    { no_ready_check: true });

    redisClient.auth("nPGIJgA4U0f9MG60Hw8IZnlIaCrVDRmf", function (err) {
    if (err) throw err;
});

redisClient.on("connect", async function () {
    console.log("Redis is connected...");
});
redisClient.on("error", async function (err) {
    console.log(err.message);
});

//Connection setup for redis
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);
const SETEX_ASYNC = promisify(redisClient.SETEX).bind(redisClient)



//========================================= creating short url ==============================================


const createUrl = async function (req, res) {
    try {
        let body = req.body
        let { longUrl } = body
        //====================================== if body is empty ==============================
        if (!isValidReqBody(body)) {
            return res.status(400).send({ status: false, message: "Please provide data in request body" })
        }
 
        //================================= if longurl is not present in body =========================
        if (!longUrl) {
            return res.status(400).send({ status: false, message: "Please provide longUrl in body" })
        }
        //============================ invalid format of longurl ===================================
        if (!isValid(longUrl)) {
            return res.status(400).send({ status: false, message: "longUrl format is not valid" })
        }
        //============================== if longurl is not correct link ==========================
        let correctLink = false
        await axios.get(longUrl)
            .then((res) => {
                if (res.status == 200 || res.status == 201) {
                    correctLink = true;
                }
            })
            .catch((error) => { correctLink = false })

        if (correctLink == false) {
            return res.status(400).send({ status: false, message: "Provide correct longurl!!" })
        };
        
        
        //If URL already Present in cache
        const cachedLongUrl = await GET_ASYNC(`${longUrl}`)
        if (cachedLongUrl) {
            const parseLongUrl = JSON.parse(cachedLongUrl)
            return res.status(201).send({ status: true, message: "longUrl already generated previously (from cache)", data: parseLongUrl })
        }
        
        //=================================== duplicate longurl ====================================
        const duplicateUrl = await urlModel.findOne({ longUrl: longUrl }).select({ longUrl: 1, shortUrl: 1, urlCode: 1, _id: 0 })
        if (duplicateUrl) {
            return res.status(409).send({ status: true,msg:"longUrl already exists", data: duplicateUrl }) //check the status code later
        }
      

        //=============================== generating a urlcode and shorturl =================================
        const urlCode = shortId.generate()
        const shortUrl = `http://localhost:3000/${urlCode}`

        //=========================== adding urlcode & shorturl keys in body ===============================
        body.urlCode = urlCode
        body.shortUrl = shortUrl

        console.log(body)
        //============================== creating data ===========================================
        const createData = await urlModel.create(body)
        console.log(createData)
        let data = {
            longUrl: createData.longUrl,
            shortUrl: createData.shortUrl,
            urlCode: createData.urlCode

        }
         //Set cache the newly created url
         if (urlCode) {
            await SETEX_ASYNC(`${longUrl}`,60*60, JSON.stringify(urlCode))
            await SETEX_ASYNC(`${urlCode}`,60*60, JSON.stringify(longUrl))
        }
        return res.status(201).send({ status: true, message: "Short url Successfully created", data: urlCode })
    }
    catch (err) {
        res.status(500).send({ error: err.message})
    }
}



// //===================================== redirecting to the longurl ==========================================

const getUrl = async function (req, res) {
    try {
        const urlCode = req.params.urlCode;
        //================================ invalid urlcode =======================================
        if (!shortId.isValid(urlCode)) {
            return res.status(400).send({ status: false, message: `Invalid urlCode: ${urlCode} provided` })
        }
        // console.log(urlCode, req.params)
        //============================== if urlcode does not exist ======================================
        const cachedUrlCode = await GET_ASYNC(`${urlCode}`)
        if (cachedUrlCode) {
            const parseUrl = cachedUrlCode
            // const cachedLongUrl = parseUrl.longUrl
            return res.status(302).redirect(parseUrl)
        }
        
        const isData = await urlModel.findOne({ urlCode });
        if (!isData) {
            return res.status(404).send({ status: false, message: "this urlCode is not present in our database" });
        }

        //========================= redirecting to the longurl =======================================
        
        await SETEX_ASYNC(`${urlCode}`,60*60,isData.longUrl)
        return res.status(302).redirect(isData.longUrl) //302 redirect status response

    } 
      catch (err) {
        res.status(500).send({ error: err.messege})
    }

}





module.exports = { createUrl, getUrl }