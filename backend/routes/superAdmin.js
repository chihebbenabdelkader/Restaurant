const express = require('express');
const router = express.Router();
const { createAdmin,getUsers,toggleUserStatus}  = require("../controllers/superAdmin");
const verifyToken = require("../middlewares/auth");



router.post('/create-admin', verifyToken ,createAdmin);
router.get('/getUsers' ,getUsers);
router.put('/toggle-user/:id', verifyToken, toggleUserStatus);



module.exports = router;
