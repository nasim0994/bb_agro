const router = require("express").Router();
const verifyAdmin = require("../middleware/verifyAdmin");
const { get, add, update } = require("../controllers/seoController");

router.get("/", get);
router.post("/add", verifyAdmin, add);
router.patch("/update/:id", verifyAdmin, update);

module.exports = router;
