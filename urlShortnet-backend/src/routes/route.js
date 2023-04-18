const { urlShorten, urlRedirecting } = require("../controller/urlShortner");
const router = require("express").Router();

router.post("/shorten", urlShorten);
router.get("/:urlCode", urlRedirecting);

router.get("/*", (req, res) => {
  res.send("Check your url");
});

module.exports = router;
