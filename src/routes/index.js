import express from "express";
import { register_controller, blog_controller } from "../controller";
import { User, Layer, Blog } from "../model";

const router = express.Router()
//Authentication
router.post('/register', register_controller.register)
router.post('/blog', blog_controller.blog)
//Admin


//App
router.post('/getblog', async (req, res) => {
    Blog.find({}).populate('user').populate('prompts').exec((err, result) => {
        if (err) res.json({message: "2 Minutes rukkja bhai error hai"})
        else res.json(result)
    })

})


export default router