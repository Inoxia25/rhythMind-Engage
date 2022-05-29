const  middlewareObj={};
 middlewareObj.isAuthenticated=function(req, res, next){
    if (req.user) {
        next();
    } else {
        
        res.render('error.ejs');
    }
}
module.exports=middlewareObj;