var express = require('express');
var router = express.Router();
const userModel = require('./users');
const passport = require('passport');
const localStrategy = require("passport-local");

passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/profile',isLoggedIn, async function(req, res, next) {
  const user = await userModel.findOne({
    username:req.session.passport.user
  });
  console.log(user);
  res.render('profile',{user});
});
router.get('/register', function(req, res, next) {
  res.render('index', {error:req.flash('error')});
  console.log(error);
});

router.get('/login',function(req,res){
  res.render('login',{err: req.flash("error")});
  console.log(req.flash('error'));
});

router.post("/register",function(req,res){
  var userdata = new userModel({
    
    username: req.body.username,
    password: req.body.password
  });

  userModel.register(userdata,req.body.password).then(function(registereduser){
    passport.authenticate("local")(req ,res ,function(){
      res.redirect('/profile');
    })
  })
});

router.post("/login",passport.authenticate("local",{
  successRedirect:"/profile",
  failureFlash: true,
  failureRedirect:"/login",


}),function(req,res){

});

router.get("/logout",function(req,res,next){
  req.logout(function(err){
    if(err) return next(err);
    res.redirect("/login");
  })
})

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/");
}
module.exports = router;
