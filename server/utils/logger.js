const mode = process.env.NODE_ENV

function info(...props){
    if(mode !== "production"){
        console.log(...props)
        console.log("------------------------------------------------------------------------")
    }
}
function warn(...props){
    if(mode !== "production"){
        console.warn(...props)
        console.log("------------------------------------------------------------------------")
    }
}
function err(...props){
    if(mode !== "production"){
        console.error(...props)
        console.log("------------------------------------------------------------------------")
    }
}

module.exports={
    info,
    warn,
    err
}