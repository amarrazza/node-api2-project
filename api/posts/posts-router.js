// implement your posts router here
const { Router } = require('express');
const Posts = require('./posts-model');

const router = Router();

router.get('/', (req, res) => {
    console.log('get posts is working');
    Posts.find()
        .then(posts => {
            res.status(200).json(posts)
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                message: "The posts information could not be retrieved"
            });
        });
});

router.get('/:id', (req, res) => {
    let { id } = req.params;
    Posts.findById(id)
        .then(post => {
            if(post){
                res.status(200).json(post)
            } else {
                res.status(404).json({
                    message: "The post with the specified ID does not exist"
                })
            }
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                message: "The post information could not be retrieved"
            });
        });
});

router.post('/', (req, res) => {
    Posts.insert(req.body)
        .then(post => {
            if(post.title || post.contents){
                res.status(400).json({
                    message: "Please provide title and contents for the post"
                });
            }else{
                res.status(201).json(post);
            }
        }).catch(() => {
            res.status(500).json({
                message: "There was an error while saving the post to the database"
            });
        });
});

module.exports = router;