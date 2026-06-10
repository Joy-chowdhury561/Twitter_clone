import express from "express"
import {signUp,logIn,logOut}  from "../controllers/auth_controller.js"
const Router=express.Router()

Router.post("/signup",signUp)
Router.post("/login",logIn)
Router.post("/logout",logOut)


export default Router  