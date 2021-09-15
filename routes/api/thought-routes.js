const router = require('express').Router();

const { getAllThoughts, getThoughtById, createThought, updateThoughtbyId, removeThoughtById, addReaction, removeReaction
}=require('../../controllers/thought-controller')

router.route('/').get(getAllThoughts).post(createThought)

router.route('/:id').get(getThoughtById).put(updateThoughtbyId).delete(removeThoughtById)

router.route('/:thoughtId/reactions').post(addReaction).delete(removeReaction)

module.exports = router;