const express = require("express");
const router = express.Router();


const { login} = require("../controllers/authUser");

const register = require("../controllers/authUser").register;
const getUserByToken = require("../controllers/authUser").getUserByToken;
const logout = require("../controllers/authUser").logout;
const getPublicUserDetails = require("../controllers/authUser").getPublicUserDetails;

router.post("/auth/login", login);

router.post("/auth/register", register);
router.post("/auth/verifToken", getUserByToken)
router.post("/auth/logout", logout);

router.get('/user/public/:userId', getPublicUserDetails);

router.get("/auth/verify-email/:tok", async(req,res,next) => {
  try{
    const user = await Etudiant.findOne({emailToken:req.params.tok});
    console.log(req.params.tok)
    if(!user){
      return res.status(400).json({
        statue: false,
        message: "Votre compte n'est pas vérifié",
      });
    }
      
      user.active = true ;
      await user.save();
      return res.status(200).json({
        statue: true,
        message: "Votre compte a éte vérifié",
        user
      });

    }
  catch(error){
    console.log(error)
  }
} );




module.exports = router;





