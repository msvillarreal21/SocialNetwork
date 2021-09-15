const { User, Thought, Reaction } = require('../models');


///api/thoughts
const thoughtController = {

    //GET to get all thoughts
    getAllThoughts(req, res) {
        Thought.find({})
            .then(dbThoughtData => res.json(dbThoughtData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err)
            });
    },

    //GET to get a single thought by its _id
    getThoughtById({params}, res) {
        Thought.findOne({ _id: params.id })
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'Opps! No Thoughts found with this id!' });
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err)
            });
    },

    //POST to create a new thought (don't forget to push the created thought's _id to the associated user's thoughts array field)
    createThought({ body }, res) {
        Thought.create(body)
            .then(dbThoughtData => {
                User.findOneAndUpdate(
                    { _id: body.userId },
                    { $push: { thoughts: dbThoughtData._id } },
                    { new: true }
                )
                    .then(dbThoughtData => {
                        if (!dbThoughtData) {
                            res.status(404).json({ message: 'Opps! No Thoughts found with this id!' });
                            return;
                        }
                        res.json(dbThoughtData);
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(400).json(err)
                    })

            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err)

            });
    
    },
//PUT to update a thought by its _id
    updateThoughtbyId({ params, body }, res) {
        Thought.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'Opps!, No thoughts found with this id!' });
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => res.status(400).json(err));
    },

    // DELETE to remove a thought by its _id
   removeThoughtById({ params }, res) {
    Thought.findOneAndDelete({ _id: params.id })
    .then(deletedThought => {
        if (!deletedThought) {
            return res.status(404).json({ message: 'No thought with this id!' });
        }
        return User.findOneAndUpdate(
            { _id: deletedThought.userId },
            { $pull: { thoughts: params.id } },
            { new: true }
        );
    })
    .then(dbUserData => {
        if (!dbUserData) {
            res.json({ message: "Successfully DELETED REACTION" });
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => res.json(err));
},

    addReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $push: { reactions: body } },
            { new: true }
        )
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No Thoughts found with this id!' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.json(err));
    },
    // remove reaction
    removeReaction({ params }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: { reactions: { reactionId: params.reactionId } } },
            { new: true }
        )
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No Thoughts found with this id!' });
                return;
            }
            res.json({ message: "Successfully DELETED REACTION" });

        })
        .catch(err => res.json(err));
    }
};

module.exports = thoughtController;