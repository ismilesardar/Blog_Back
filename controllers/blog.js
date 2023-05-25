const fs = require('fs');
const slugify =require("slugify");
const Blog = require('../models/blog');

//module scaffolded
const blogCon = {};

blogCon.create = async (req,res) => {
    try {
        // 1. destructure name, email, password from req.body
        const {title,body} = req.fields;
        //photo file destructure
        const {photo} = req.files;
        console.log(req.user)
        //validation
        switch (true) {
            case !title.trim():
                return res.status(404).json({error:"Name is required!"});
            case !body.trim():
                return res.status(404).json({error:"Description is required!"});
            case photo && photo.size > 5e+6://5000000
                return res.status(404).json({error:"Image should be less than 5mb!"});
        }
        //product create
        const newBlog = new Blog({...req.fields, author:req.user['author'], slug: slugify(title)});
        //photo
        if(photo){
            newBlog.photo.data = fs.readFileSync(photo.path);
            newBlog.photo.contentType = photo.type;
        }
        //data save
        await newBlog.save();
        //user response
        res.status(201).json({newBlog});
    } catch (error) {
        return res.status(404).json({error:error.message});
    }
}

//get all product
blogCon.list = async (req,res) => {
    try {
        const allBlog = await Blog.find({})
                                 .select("-photo")
                                 .limit(12)
                                 .sort({createdAt: -1});
        //user response
        res.status(200).json(allBlog);                    
    } catch (error) {
        console.log(error)
        return res.status(404).json({error:error.message});
    }
}

//read single product
blogCon.read = async (req,res) => {
    try {
        const sinBlog = await Blog.findOne({slug:req.params.slug})
                                  .select("-photo");
        //user response
        res.status(200).json({sinBlog});                    
    } catch (error) {
        console.log(error)
        return res.status(404).json({error:error.message});
    }
}

//read with photo
blogCon.photo = async (req,res) => {
    try {
        //find by id
        const sinBlog = await Blog.findById(req.params.blogId).select('photo');

        if(sinBlog.photo.data){
            res.set('Content-Type', sinBlog.photo.contentType);
            res.set("Cross-Origin-Resource-Policy", "cross-origin");
            return res.status(200).send(sinBlog.photo.data)
        } 
    } catch (error) {
        console.log(error);
        return res.status(404).json({error:error.message});
    }
}

//delete product
blogCon.remove = async (req,res) => {
    try {
        //find by id nad Delete
        const remove = await Blog.findByIdAndDelete(req.params.blogId).select('-photo');
        //user response
        res.status(200).json(remove);
        
    } catch (error) {
        console.log(error);
        return res.status(404).json({error:error.message});
    }
}

//update product
blogCon.update = async (req,res) => {
    try {
        // 1. destructure name, email, password from req.body
        const {title,body} = req.fields;
        //photo file destructure
        const {photo} = req.files;
        //validation
        switch (true) {
            case !title.trim():
                return res.status(404).json({error:"title is required!"});
            case !body.trim():
                return res.status(404).json({error:"Description is required!"});
            case photo && photo.size > 5e+6://5000000
                return res.status(404).json({error:"Image should be less than 5mb!"});
        }
        //product update
        const blogUpdate = await Blog.findByIdAndUpdate(
            req.params.blogId,
            {
                ...req.fields,
                slug:slugify(title),
            },
            {new:true}
        );
        //photo
        if(photo){
            blogUpdate.photo.data = fs.readFileSync(photo.path);
            blogUpdate.photo.contentType = photo.type;
        }
        //data save
        await blogUpdate.save();
        //user response
        res.status(201).json({blogUpdate});

    } catch (error) {
        return res.status(404).json({error:error.message});
    }
}

module.exports = blogCon;