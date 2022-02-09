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

router.post('/', async (req, res) => {
    try {
        if(!req.body.title || !req.body.contents){
            res.status(400).json({
                message: "Please provide title and contents for the post"
            });
        }else{
            const newId = await Posts.insert(req.body)
            res.status(201).json({...newId, ...req.body});
        }
    }
    catch {
        res.status(500).json({
            message: "There was an error while saving the post to the database"
        });
    }
});

router.put('/:id', async (req, res) => {
    let { id } = req.params;
    const { body } = req;
    try {
        const updated = await Posts.update(id, body)
        if(!updated){
            res.status(404).json({
                message: "The post with the specified ID does not exist"
            });
        } else if(!req.body.title || !req.body.contents) {
            res.status(400).json({
                message: "Please provide title and contents for the post"
            });
        } else {
            res.status(200).json({id, ...body})
        }
    }
    catch {
        res.status(500).json({
            message: "The post information could not be modified"
        });
    }
})

router.delete('/:id', (req, res) => {
    let { id } = req.params;
    Posts.remove(id)
    .then(resp => {
        if(resp < 1){
            res.status(404).json({
                message: "The post with the specified ID does not exist"
            });
        } else {
            res.status(200).json({
                message: "Post deleted!"
            });
        }
    }).catch(() => {
        res.status(500).json({
            message: "The post could not be removed"
        });
    })
})

router.get('/:id/comments', (req, res) => {
    let { id } = req.params;
    Posts.findCommentById(id)
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
            message: "The comments information could not be retrieved"
        });
    });
})
        

module.exports = router;