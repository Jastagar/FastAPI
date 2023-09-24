import axios from "axios"

const url = "http://localhost:8000/api"

var token = localStorage.getItem("authToken")

axios.interceptors.request.use((req)=>{
    req.headers['authorization'] = token? token:"nil"
    return req
})

// Requests --------->

async function login(data){
    const res = await axios.post(url+ "/login" ,data)
    return res.data
}
async function signup(data){
    const res = await axios.post(url+ "/signup" ,data)
    return res.data
}
async function verifyAuth(){
    const res = await axios.get(url+ "/verify")
    return res.data
}


async function getTasks(){
    const res = await axios.get(url+ "/tasks")
    return res.data
}
async function addTask(data){
    const res = await axios.post(url+ "/tasks",data)
    return res.data
}


export {
    login,
    verifyAuth,
    signup,

    getTasks,
    addTask,
}