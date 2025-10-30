 import express from "express";
import { CreateUser, GetUser, GetUserById, LoginUser } from "../controller/UserController.js";
import { verifyToken, isAdmin } from "../moddleware/TokenVerify.js";

export const route = express.Router();

 
route.post("/createuser", CreateUser);
route.post("/loginUser", LoginUser);

 
route.get("/getuser", verifyToken, isAdmin, GetUser);
route.get("/getuserbyid/:id", verifyToken, isAdmin, GetUserById);
