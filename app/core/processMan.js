const spawn = require('child_process').spawn;

module.exports.extension = function(filePath,extension){
    if(filePath.lastIndexOf(".")>-1){
        filePath = filePath.substr(0,filePath.lastIndexOf(".")) + "." + extension;
    }else{
        filePath += "." + extension;
    }
    return filePath;
}

module.exports.newProcess = function(command,args,input,autoKillTime,cwd,callback){

    var finished = false;
    close = function(err,timout,code,stdout,stderr){
        if(finished){
            console.log("child process already finished");
        }else{
            finished = true;
            if(autoKillTime && !timeout){
                clearTimeout(autokillTimeout);
            }
            callback(err,timout,code,stdout,stderr);
        }
    }

    var stdout = "";
    var stderr = "";
    var p = spawn(command,args,{
        cwd : cwd
    });

    var timeout = false;
    var autokillTimeout;
    if(autoKillTime){
        autokillTimeout = setTimeout(function(){
            timeout = true;
            p.kill();
        },autoKillTime);
    }

    p.stdout.on("data",function(data){
        stdout += data;
    });
    p.stderr.on("data",function(data){
        stderr += data;
    });

    p.on("close",function(code){
        close(false,timeout,code,stdout,stderr);
    });

    p.on("exit",function(code){
        //close(false,timeout,code,stdout,stderr);
    });

    p.on("error",function(err){
        close(err,timeout,null,stdout,stderr);
    });

    p.stdin.write(input+"\n");
}
