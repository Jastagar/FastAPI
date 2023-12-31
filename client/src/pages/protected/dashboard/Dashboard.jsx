import React, { useEffect, useState } from 'react'
import "./dashboardcss.css"
import { addTask, deleteTask, getTasks, updateTask } from '../../../server/server'
import { MDBInput, MDBTextArea } from 'mdb-react-ui-kit'

function AddTaskForm({setNewTasks}){
    
    const[title,setTitle] = useState("")
    const[deadline,setDeadline] = useState(Date.now() + 30*24*60*60*1000) // 30 day default deadline for now
    const[description,setDescription] = useState("")

    async function handleAddTask(e){
      e.preventDefault()
      const dataToSend ={
        title,
        deadline,
        description,
      }
      const res = await addTask(dataToSend)
      if(res.error){
        alert(res.message)
        return
      }
      setNewTasks(prev=>([...prev,dataToSend]))
      setDescription('')
      setTitle('')
      const newTaskList = await getTasks();
      setNewTasks(newTaskList.data)
      console.log("RES->",res)
    }

    return(
      <div className='p-5 shadow-xl rounded-md sticky top-8 max-h-[50dvh]'>
        <form onSubmit={handleAddTask}>
            <h1>Add New Task:</h1>
            <MDBInput required value={title} onChange={(e)=>{setTitle(e.target.value)}} 
              wrapperClass='mb-4' label='Kya krna hai:' type='text'/>
            <MDBTextArea required value={description} onChange={(e)=>{setDescription(e.target.value)}}
              wrapperClass='mb-4' label='Kyu/kaise krna hai' type='text'/>

            <button type='submit' className="btn btn-primary mb-4 w-100">Add Task</button>
        </form>
      </div>
    )
}

function EachTaskBox({title,deadline,description,_id,prevTasks,setNewTasks,completed}){

    const [editMode,setEditMode] = useState(false)

    const [newTitle,setNewTitle] = useState(title)
    const [newDescription,setNewDescription] = useState(description)
    const [newDeadline,setNewDeadline] = useState(deadline)

    async function handleDeleteTask(){

      const res = await deleteTask(_id)
      const newTaskList = await getTasks();
      console.log(newTaskList.data)
      setNewTasks(newTaskList.data)
    }

    async function handleEditing(){
      setEditMode(!editMode)
      if(!editMode || (newTitle===title && newDescription===description && newDeadline==deadline)) return

      console.log("Saving...")
      const dataToSend = {
        title:newTitle,
        deadline:newDeadline,
        description:newDescription,
        id:_id
      }
      const res = await updateTask(dataToSend)
      if(res.error){
        alert(res.message)
        return
      }
      const newTaskList = await getTasks();
      setNewTasks(newTaskList.data)
      console.log("Updated Res->",res)
      
    }
    
    async function handleCompletion(){
      console.log("marking as completed")
      const dataToSend = {
        title,
        deadline,
        description,
        completed:!completed,
        id:_id
      }
      const res = await updateTask(dataToSend)
      if(res.error){
        alert(res.message)
        return
      }
      const newTaskList = await getTasks();
      setNewTasks(newTaskList.data)
      console.log("Updated Res->",res)
    }
    return(
      <div className={`shadow-xl rounded-md m-2 p-3 ${completed? 'opacity-25':''}`}>
        
        <h3>{!editMode? title:<MDBInput placeholder='title' value={newTitle} onChange={(e)=>{setNewTitle(e.target.value)}} />}</h3>
        <h6><span className='text-red-600'>Deadline by:</span>  {new Date(deadline).toDateString()}</h6>
        <div>{!editMode? description:<MDBTextArea placeholder='description' value={newDescription} onChange={(e)=>{setNewDescription(e.target.value)}} />}</div>
        <div className='flex justify-end pt-3'>
          <button className='text-yellow-500 mx-1' onClick={handleEditing} type='button'>{editMode?'Save':'Edit'}</button>
          <button className='text-red-500 mx-1' onClick={handleDeleteTask} type='button'>Delete</button>
          <button className='text-green-500 mx-1' onClick={handleCompletion} type='button'>Completed</button>
        </div>
        
      </div>
    )
}

export default function Dashboard() {
  const [tasks,setTasks] = useState([])
  
  useEffect(()=>{
    getTasks().then(e=>{
      setTasks(e.data)
    }).catch(alert)
  },[setTasks])
  
  return (
    <div className='flex h-[100dvh] justify-center relative'>
        <AddTaskForm prevTasks={tasks} setNewTasks={setTasks} />
        <div className='flex-grow w-50'>
          {tasks.length?
            tasks.map((e,i) =>(
              <EachTaskBox prevTasks={tasks} setNewTasks={setTasks} key={"EachTaskKey"+4*i+e._id} {...e} />
            ))
            :<>
              <div className='border h-100 flex flex-col justify-center items-center'>
                <h3>Shabash launde, Sara kam krliya.</h3>
                <h6>(ya aalsi itna hogya k kam add he ni krra)</h6>
              </div>
            </>
          }
        </div>
    </div>
  )
}
