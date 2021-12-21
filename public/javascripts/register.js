const handleSubmit=async(e)=>{
    e.preventDefault()
    body={emailid:emailid.value,password:password.value,name:username.value}
    let res=await fetch("/auth/adduser",{
        method:"post",
        headers:{
            "content-type":"application/json",
            "accept":"application/json",
            "mode":"cors"
        },
        body:JSON.stringify(body)
    })
    res=await res.json()
    if(res.status){
          localStorage.setItem("token",JSON.stringify(res.token))
          location.href="/"
    }
    else{
        msg.innerHTML=JSON.stringify(res.error)
    }
  }
  let signupForm=document.querySelector("#signupForm")
  let emailid=document.querySelector("#emailid")
  let username=document.querySelector("#username")
  let password=document.querySelector("#password")
  let msg=document.querySelector("#msg")
  signupForm.addEventListener("submit",handleSubmit)