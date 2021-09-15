const { User, Thought } = require('../models');

const userController = {

    // GET all users
    getAllUser(req, res) {
        User.find({})
            .then(dbUserData => res.json(dbUserData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err)
            });
    },

    // GET a single user by its _id and populated thought and friend data
    getUserById({ params }, res) {
        User.findOne({ _id: params.id })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'Opps! No user found with this id!' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err)
            });
    },

    // POST a new user
    createUser({ body }, res) {
        User.create(body)
            .then(dbUserData => res.json(dbUserData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err)
            });
    },

    // PUT to update a user by its _id
    updateUserById({ params, body }, res) {
        User.findOneAndUpdate({ _id: params.id }, body, { new: true })//new:true returns the updated version
            .then(dbUserData => {
                if (!dbUserData) {
                    return res.status(404).json({ message: 'Opps! No user found with this id!' });
                }
                res.json(dbUserData);
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err)
            });
    },

    // DELETE to remove user by its _id
    deleteUserById({ params }, res) {
        User.findOneAndDelete({ _id: params.id })
            .then(dbUserData => {
                if (!dbUserData) {
                    return res.status(404).json({ message: 'Opps! No user found with this id!' });
                }
                // BONUS: Remove a user's associated thoughts when deleted.
                User.updateMany(//remove friend from a user list
                    { _id: { $in: dbUserData.friends } },
                    { $pull: { friends: params.id } }
                )
                    .then(() => {
                        Thought.deleteMany({ username: dbUserData.username })
                            .then(() => {
                                res.json({ message: "Successfully deleted user" });
                            })
                            .catch((err) => res.status(400).json(err));
                    })
                    .catch((err) => res.status(400).json(err));
            })
            .catch((err) => res.status(400).json(err));
    },

    ///api/users/:userId/friends/:friendId
    // POST to add a new friend to a user's friend list
    addFriendtoList({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.userId },
            { $addToSet: { friends: params.friendId } },
            { new: true, runValidators: true })
            .then(dbUserData => {
                if (!dbUserData) {
                    return res.status(404).json({ message: 'Opps! No user found with this id!' });
                }
                res.json(dbUserData);
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err)
            });
    },
    //DELETE to remove a friend from a user's friend list
    removeFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.userId },
            { $pull: { friends: params.friendId } },
            { new: true, runValidators: true }
        )
            .then(dbUserData => {
                if (!dbUserData) {
                    return res.status(404).json({ message: 'Opps! No user found with this id!' });
                }
                res.json({ message: 'Sucessfully removed friends '})
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err)
            });
    }
}

module.exports = userController;