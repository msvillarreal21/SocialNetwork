const router=require('express').Router();
const apiRoutes=require('.')

router.use('/api/',apiRoutes);

router.use((req,res)=>{
    res.status(404).send('<h1> Opps! 404 Error!</h1>')
})

module.exports = router;