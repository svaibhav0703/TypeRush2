import express from "express";
import auth from "../middleware/auth.js";
import authAdmin from "../middleware/authAdmin.js";
import {
  createParagraph,
  getParagraph,
} from "../controllers/paragraphController.js";
const router = express.Router();

router.get("/selectText", auth, getParagraph); //  we will use query parameters

router.post("/createText", auth, authAdmin, createParagraph);

export default router;
