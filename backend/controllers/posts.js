const PostMessage = require('../models/postMessage')
const mongoose = require('mongoose')


exports.getPost = async (req,res) => {
    const {id} = req.params
    console.log(id)
    try{
        const post = await PostMessage.findById(id)
        res.status(200).json(post)
    }
    catch(error){
        res.status(404).json({message:error.message})
    }   
    
}
exports.getPosts = async (req,res) => {
    const {page} = req.query
    try {
        const LIMIT = 6
        const startIndex = (Number(page)-1)*LIMIT // get the start index of every page
        const total = await PostMessage.countDocuments({})

        const posts = await PostMessage.find().sort({_id: -1}).limit(LIMIT).skip(startIndex) // fetch post for a particular page and skip others sort them by latest
        
        res.status(200).json({data: posts,currentPage:Number(page),numberOfPage:Math.ceil(total/LIMIT)})
    } catch (error) {
        res.status(404).json({message:error.message})
    }
}

exports.getPostsBySearch = async (req,res) => {
    const {searchQuery,tags} = req.query
    try {
        const title = new RegExp(searchQuery,'i')
        const posts = await PostMessage.find({ $or:[{title},{tags:{ $in : tags.split(',')}}]})
        res.status(200).json({data: posts})
    } catch (error) {
        res.status(404).json({message:error.message})
    }
}

exports.createPosts = async (req,res) => {
    const post = req.body
    const newPost = new PostMessage({...post,creator:req.userId,createdAt:new Date().toISOString()})
    try {
        await newPost.save()
        res.status(201).json(newPost)
    } catch (error) {
        res.status(409).json({message:error.message})
    }
}

exports.updatePosts = async (req,res) => {
    const {id:_id} = req.params
    const post = req.body

    if(!(mongoose.Types.ObjectId.isValid(_id))) return res.json(404).send('No post with that ID');

    const updatedPosts = await PostMessage.findByIdAndUpdate(_id,{...post,_id} ,{new:true})

    res.json(updatedPosts)
}

exports.deletePosts = async (req,res) => {
    const {id} = req.params

    if(!(mongoose.Types.ObjectId.isValid(id))) return res.json(404).send('No post with that ID');
    const post = await PostMessage.findById(id)
    
    await PostMessage.findByIdAndRemove(id)

    res.json({message:'Post deleted Successfully'})
}

exports.likePost  = async (req,res) => {
    const {id} = req.params
    if(!req.userId) return res.json({message:'Unauthenticated'})
    if(!(mongoose.Types.ObjectId.isValid(id))) return res.json(404).send('No post with that ID')

    const post = await PostMessage.findById(id)

    const index = await post.likes.findIndex((id) => id === String(req.userId));

    if(index === -1){
        post.likes.push(req.userId)
    }else{
        post.likes = post.likes.filter((id) => id!== String(req.userId))
    }
   
    const updatedPost = await PostMessage.findByIdAndUpdate(id,post,{new:true})
    res.json(updatedPost)
}