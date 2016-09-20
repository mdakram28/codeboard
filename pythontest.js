var shell = require("./app/core/executor");

shell.queueSubmission("java",`
public class test{
    public static void main(String[] args){
        System.out.println("Hello world from java");
    }
}
`,["123","name","is","mohd","akram","ansari"],
function(err,stderr,stdout){
    if(err)throw err;
    if(stderr){
        console.log("Compilation failed");
        console.log(stderr);
    }else{
        console.log("Compilation successful");
    }
},
function(testcase_index,err,stderr,stdout){
    if(stderr){
        console.log(testcase_index+ " : " +stdout+stderr);
    }else{
        console.log(testcase_index+ " : " +stdout);
    }
});

shell.queueSubmission("python",`
print("Hello from python")
`,["123","name","is","mohd"],
function(err,stderr,stdout){
    if(err)throw err;
    if(stderr){
        console.log("Compilation failed");
        console.log(stderr);
    }else{
        console.log("Compilation successful");
    }
},
function(testcase_index,err,stderr,stdout){
    if(stderr){
        console.log(testcase_index+ " : " +stdout+stderr);
    }else{
        console.log(testcase_index+ " : " +stdout);
    }
});

shell.queueSubmission("node",`
console.log("hello from node")
`,["123","name","is","mohd"],
function(err,stderr,stdout){
    if(err)throw err;
    if(stderr){
        console.log("Compilation failed");
        console.log(stderr);
    }else{
        console.log("Compilation successful");
    }
},
function(testcase_index,err,stderr,stdout){
    if(stderr){
        console.log(testcase_index+ " : " +stdout+stderr);
    }else{
        console.log(testcase_index+ " : " +stdout);
    }
});

setTimeout(function () {

    shell.queueSubmission("cpp",`
    #include <iostream>
    #include <dos.h>
    using namespace std;
    int main(){
        cout<<"Hi baby !! c++"<<endl;
        return 0;
    }
    `,["123","name","is","mohd"],
    function(err,stderr,stdout){
        if(err)throw err;
        if(stderr){
            console.log("Compilation failed");
            console.log(stderr);
        }else{
            console.log("Compilation successful");
        }
    },
    function(testcase_index,err,stderr,stdout){
        if(stderr){
            console.log(testcase_index+ " : " +stdout+stderr);
        }else{
            console.log(testcase_index+ " : " +stdout);
        }
    });
}, 10000);
