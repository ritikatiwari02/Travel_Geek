const express = require('express')

const router = express.Router()
const {getPostsBySearch,getPosts,getPost, createPosts,updatePosts,deletePosts,likePost} = require('../controllers/posts')
const { auth } = require('../middleware/auth')

router.get('/',getPosts)
router.get('/search',getPostsBySearch)
router.get('/:id',getPost)
router.post('/',auth,createPosts)
router.patch('/:id',auth,updatePosts)
router.delete('/:id',auth,deletePosts)
router.put('/:id/likePost',auth,likePost)


module.exports = router