const express = require('express');
const formidable =require("express-formidable");
const blogCon = require('../controllers/blog');
const {isSigning,isAdmin} = require('../middlewares/auth');
const router = express.Router();

//products create router
router.get('/allBlog',blogCon.list);
router.get("/blog/:slug", blogCon.read);

router.get("/blog/photo/:blogId", blogCon.photo);
router.post('/blog-create',isSigning,isAdmin,formidable(),blogCon.create);
router.delete("/blog/remove/:blogId", isSigning, isAdmin, blogCon.remove);
router.post("/blog/update/:blogId", isSigning, isAdmin, formidable(), blogCon.update);

module.exports = router;