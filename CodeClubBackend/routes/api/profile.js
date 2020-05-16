const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

//Load Person Model
const Person = require("../../models/Person");

//Load Profile Model
const Profile = require("../../models/Profile");

// @type    GET
//@route    /api/profile/
// @desc    route for personnal user profile
// @access  PRIVATE
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (!profile) {
          return res.status(404).json({ profilenotfound: "No profile Found" });
        }
        res.json(profile);
      })
      .catch(err => console.log("got some error in profile " + err));
  }
);

// @type    POST
//@route    /api/profile/
// @desc    route for UPDATING/SAVING personnal user profile
// @access  PRIVATE
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const profileValues = {};
    profileValues.user = req.user.id;
    if (req.body.entrynum) profileValues.entrynum = req.body.entrynum;
    if (req.body.fullname) profileValues.fullname = req.body.fullname;
    
    //get social links
    profileValues.social = {};

    if (req.body.hackerrank) profileValues.social.hackerrank = req.body.hackerrank;
    if (req.body.codechef) profileValues.social.codechef = req.body.codechef;
    if (req.body.linkedin) profileValues.social.linkedin = req.body.linkedin;
    if (req.body.github) profileValues.social.github = req.body.github;

    //Do database stuff
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (profile) {
          Profile.findOneAndUpdate(
            { user: req.user.id },
            { $set: profileValues },
            { new: true }
          )
            .then(profile => res.json(profile))
            .catch(err => console.log("problem in update" + err));
        } else {
          Profile.findOne({ entrynum: profileValues.entrynum })
            .then(profile => {
              //Username already exists
              if (profile) {
                res.status(400).json({ entrynum: "Username already exists" });
              }
              //save user
              new Profile(profileValues)
                .save()
                .then(profile => res.json(profile))
                .catch(err => console.log(err));
            })
            .catch(err => console.log(err));
        }
      })
      .catch(err => console.log("Problem in fetching profile" + err));
  }
);

// @type    POST
//@route    /api/profile/username
// @desc    route for getting profiles publically from username 
//          like codeclub.smvdu/ayushsatyam will fetch profile for ayushsatyam
// @access  PUBLIC
router.get('/:username',
(req,res)=>{
  Profile.findOne({username : req.params.username})
  .populate("user",["name","profilepic"])
  .then(profile =>{
    if (!profile) {
      res.status(404).json({ usernotfound: "unable to find user" })
    }
    res.json(profile);
  } 
  )
  .catch(err=> console.log('problem in fetching profile ' + err));
});

// @type    DELETE 
//@route    /api/profile/
// @desc    route for deleting user based on ID
// @access  PUBLIC
router.delete('/',passport.authenticate('jwt',{session:false}),(req,res)=>{
  Profile.findOne({user:req.user.id})
  Profile.findByIdAndRemove({ user: req.user.id })
    .then( ()=>{
      Person.findOneAndRemove({_id:req.user.id})
        .then(()=>res.json({success:'delete was a suceess'}))
        .catch(err=>console.log(err));
    })
    .catch(err=>console.log(err));
})

module.exports = router;
