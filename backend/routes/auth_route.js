import express from "express"
import {signUp,logIn,logOut,getMe}  from "../controllers/auth_controller.js"

import {protectRoute} from "../middleware/protectRoute.js"
const Router=express.Router()


Router.post("/signup",signUp)
Router.post("/login",logIn)
Router.post("/logout",logOut)
Router.get("/getme",protectRoute,getMe)

export default Router  