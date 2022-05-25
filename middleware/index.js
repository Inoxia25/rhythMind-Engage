const  middlewareObj={};
 middlewareObj.isAuthenticated=function(req, res, next){
    if (req.user) {
        next();
    } else {
        res.redirect('/auth/spotify');
    }
}
module.exports=middlewareObj;