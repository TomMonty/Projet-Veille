const express = require("express");
const router = express.Router();
const veilles = require("../services/getVeille");

router.get("/", async function (req, res, next) {
    try {
        res.json(await veilles.getMultiple(req.query.page));
    } catch (err) {
        console.log(`CALINER ET TERMINER: ${err.message}`);
        next(err);
    }
});

module.exports = router;
