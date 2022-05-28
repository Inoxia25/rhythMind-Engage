const  middlewareObj={};
 middlewareObj.isAuthenticated=function(req, res, next){
    if (req.user) {
        next();
    } else {
        alert('You need to be logged in to use this feature!');
        res.redirect('/home');
    }
}
module.exports=middlewareObj;