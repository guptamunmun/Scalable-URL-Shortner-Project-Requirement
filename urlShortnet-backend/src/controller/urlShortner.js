const shortid = require("shortid");
const url = require("../model/user");

const urlShorten = async function (req, res) {
  try {
    let reqbody = req.body;
    if (Object.keys(reqbody).length == 0)
      return res
        .status(400)
        .send({ status: false, message: "Provide data in request body" });

    //******************* Distructering ********************************

    const { longUrl, ...rest } = reqbody;

    if (Object.keys(rest).length > 0)
      return res.status(400).send({
        status: false,
        message: "request body must contain only longUrl",
      });

    // ********************* Validation of Url *******************************

    const checkurl = await url.findOne({ longUrl: longUrl });

    if (checkurl) {
      return res.status(200).send({
        status: true,
        message: "Url is already present",
        data: checkurl,
      });
    }

    const shortUrl = shortid.generate(longUrl).toLowerCase();

    const createData = await url.create({ longUrl, shortUrl });
    let createselected = {
      longUrl: createData.longUrl,
      shortUrl: createData.shortUrl,
    };
    return res.status(201).send({
      status: true,
      message: "Created Successfully",
      data: createselected,
    });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};

const urlRedirecting = async function (req, res) {
  try {
    let paramsUrlCode = req.params.urlCode;
    const requireData = await url.findOne({ shortUrl: paramsUrlCode });
    if (requireData == null)
      return res.status(404).send({
        status: false,
        message: `No URL found with this ${paramsUrlCode}`,
      });

    const longUrl = requireData.longUrl;

    return res.status(302).redirect(longUrl);
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = { urlShorten, urlRedirecting };
