var $ = module.exports;

$.modules = {
    "interceptor" : require("./interceptors")
};
$.routes = {};

$.setio = function(iot){
    $.io = iot;
}


$.initDAO = function(modules){
    modules.forEach(function(mod){
        try{
            module.exports.modules[mod.toLowerCase()] = require("./dao/"+mod);
            console.log("DAO successfully initialized : "+mod);
        }catch(err){
            console.log("Failed to initialize DAO : "+mod);
            throw err;
        }
    });
}

$.initRoutes = function(routes){
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

$.injectDAO = function(modules){
    if(typeof modules == "object"){
        return function(req,res,next){
            modules.forEach(function(mod){
                try{
                    req[mod] = module.exports.modules[mod.toLowerCase()];
                    console.log("DAO injected : "+mod);
                    next();
                }catch(err){
                    console.log("Failed to inject DAO : "+mod);
                    throw err;
                }
            });
        }
    }else{
        return module.exports.modules[modules.toLowerCase()];
    }
}

$.inject = function(module){
    if($.modules[module]){
        return module;
    }else{
        throw new Error(`module not found ${module}`);
    }
}

$.injectRoute = function(app,path,route){
    try{
        module.exports.routes[route] = require("./routes/"+route);
        module.exports.routes[route].init(module.exports.injectDAO,$.io);
        app.use(path,module.exports.routes[route].router);
        console.log("Route mounted : "+route);
    }catch(err){
        console.log("Failed to mount route : "+route);
        throw err;
    }
}
