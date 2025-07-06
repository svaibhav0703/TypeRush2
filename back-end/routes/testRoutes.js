import express from "express";
import auth from "../middleware/auth.js";
import {
  addTest,
  getTest,
  getRecentTests,
  getTopTests,
  getMostAccurateTests,
  getavgSpeedAndAccuracy,
  getTotalTest,
} from "../controllers/testController.js";

const router = express.Router();

router.post("/addTest", auth, addTest);
router.get("/getTest", auth, getTest);
router.post("/getRecentTests", auth, getRecentTests);
router.get("/getTopTests", auth, getTopTests);
router.get("/getMostAccurateTests", auth, getMostAccurateTests);
router.post("/getAvgSpeedAndAccuracy", auth, getavgSpeedAndAccuracy);
router.post("/getTotalTests", auth, getTotalTest);

export default router;
