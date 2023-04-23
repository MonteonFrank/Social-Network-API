const router = require("express").Router();

const homeRoutes = require("./homeRoutes")
const apiRoutes = require("./API");

router.use("/", homeRoutes);
router.use("/api", apiRoutes);

router.use((req, res) => {
    return res.send("Wrong Route!");

});

module.exports = router;