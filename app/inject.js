module.exports.modules = {};
module.exports.routes = {};

module.exports.initDAO = function(modules){
    modules.forEach(function(mod){
        try{
            module.exports.modules[mod] = require("./dao/"+mod);
            console.log("DAO successfully initialized : "+mod);
        }catch(err){
            console.log("Failed to initialize DAO : "+mod);
            throw err;
        }
    });
}

module.exports.initRoutes = function(routes){
    routes.forEach(function(route){
        try{
            module.exports.routes[route] = require("./routes/"+route);
            module.exports.routes[route].init(module.exports.injectDAO);
            console.log("Route successfully initialized : "+route);
        }catch(err){
            console.log("Failed to initialize route : "+route);
            throw err;
        }
    });
}

module.exports.injectDAO = function(modules){
    return function(req,res,next){
        modules.forEach(function(mod){
            try{
                req[mod] = module.exports.modules[mod];
                console.log("DAO injected : "+mod);
                next();
            }catch(err){
                console.log("Failed to inject DAO : "+mod);
                throw err;
            }
        });
    }
}

module.exports.injectRoute = function(app,path,route){
    try{
        app.use(path,module.exports.routes[route].router);
        console.log("Route mounted : "+route);
    }catch(err){
        console.log("Failed to mount route : "+route);
        throw err;
    }
}
