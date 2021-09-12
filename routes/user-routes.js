const router=require('express').Router();

const { getAllUser, getUserById, createUser, updateUserById, deleteUserById, addFriendtoList, removeFriend
}=require('../../controllers/user-controller');

router.route('/').get(getAllUser).post(createUser);

router.route('/:id').get(getUserById).put(updateUserById).delete(deleteUserById)

router.route('/:userId/friends/:friendId').post(addFriendtoList).delete(removeFriend)

module.exports=router;