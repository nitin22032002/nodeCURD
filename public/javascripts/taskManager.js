let task=document.querySelector('#task')
let tag=document.querySelector('#tag')
let taskStatus=document.querySelector('#status')
let taskBody=document.querySelector("#taskbody")
let taskForm=document.querySelector("#taskForm")
let logoutBtn=document.querySelector("#logoutbtn")
let msg=document.querySelector("#msg")
let btn=document.querySelector("#btn")
let statusArray=['InComplete',"Partial Complete","Complete"]
const handleLogout=()=>{
    localStorage.removeItem("token")
    location.href="/auth/login"
}

const sendRequest=async(method,body,url,cb)=>{
    let res=await fetch(url,{
        method:method,
        headers:{
            "content-type":"application/json",
            "accept":"application/json",
            "mode":"cors",
            "Authorization":`Bearer ${JSON.parse(localStorage.getItem("token"))}`
        },
        body
    })
    let code=res.status
    res=await res.json()
    if(res.status){
        cb(res)
    }
    else{
        if(code===401){
            alert("Invalid User")
            handleLogout()
        }
        else{
            msg.innerHTML=JSON.stringify(res.error)
        }
    }
}

const addTask=async(e)=>{
    e.preventDefault()
    let taskid=btn.children[0].getAttribute("taskid");
    if(taskid){
        let body={task:task.value,tag:tag.value,status:taskStatus.value}
       await sendRequest("put",JSON.stringify(body),`/updatetask/${taskid}`,(res)=>{
            let Mytask=document.querySelector(`#row${taskid}`)
            Mytask.querySelector(".task").innerHTML=task.value
            Mytask.querySelector(".tag").innerHTML=tag.value
            Mytask.querySelector(".status").innerHTML=statusArray[parseInt(taskStatus.value)-1]
            btn.innerHTML=`<input value="Add Task" type="submit"">`
            
        })      
    }
    else{

        let body={task:task.value,tag:tag.value,status:taskStatus.value}
        await sendRequest("post",JSON.stringify(body),"/addtask",(res)=>{setTask(res.task)})
    }
    task.value=""
    tag.value="Personal"
    taskStatus.value="1"
}

const fetchAllTask=async()=>{
    sendRequest("get",undefined,"/getalltask",(res)=>{for(let val of res.task){
        setTask(val)
    }})  
}

const setTask=(task)=>{
    
    s=`
    <tr id="row${task._id}" style="background-color:${task.status=="1"?'Red':task.status=="2"?'orange':'green'};">
    <td><button style="margin-right:2px;" onclick="handleDeleteTask('${task._id}')">Delete</button><button onclick="handleEditTask('${task._id}')">Edit</button></td>
    <td>${task._id}</td>
    <td class="task">${task.task}</td>
    <td class="tag">${task.tag}</td>
    <td class="status">${statusArray[parseInt(task.status)-1]}</td>
    <td>${new Date(task.date).toUTCString()}</td>
    </tr>
    `
    taskBody.innerHTML+=s;
}

const handleDeleteTask=(taskid)=>{
    sendRequest("delete",undefined,`/deletetask/${taskid}`,(res)=>{
        document.querySelector(`#row${taskid}`).remove()
    })
}
const handleEditTask=(taskid)=>{
    let Mytask=document.querySelector(`#row${taskid}`)
    task.value=Mytask.querySelector(".task").innerHTML
    tag.value=Mytask.querySelector(".tag").innerHTML
    taskStatus.value=Mytask.querySelector(".status").innerHTML
    btn.innerHTML=`<input value="Update Task" type="submit" taskid='${taskid}'">`
}



fetchAllTask()
logoutBtn.addEventListener('click',handleLogout)
taskForm.addEventListener("submit",addTask)


