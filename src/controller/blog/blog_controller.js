import {Blog} from "../../model"


const blog_controller = {
    async createblog (req, res, next) {
       const blog =  req.body
        const abc = new Blog(blog)
        const result = await abc.save()

        res.json({ status : 200, result});
    }
}

export default blog_controller