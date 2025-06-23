import {useState} from "react"
import {useNavigate} from "react-router-dom"
import "./style.css"

function AdminLogin()
{
   const [username,setu]=useState("")
   const [password,setp]=useState("")
   const nav=useNavigate()
   const Login=async(e)=>{
      e.preventDefault();
      const response=await fetch("http://localhost:8888/",{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({username,password})
      }
     )
     const result=await response.json()
     if(result.message=="True")
     {
          nav("/dashboard")
     }
     else
     {
         alert(result.message)
     }
   }
   return(
    <div>
    <h1> ADMIN LOGIN </h1>
    <form onSubmit={Login}>
     <input type="text" placeholder="enter admin name" value={username} onChange={(e)=>(setu(e.target.value))}/><br/>
     <input type="password" placeholder="enter admin password" value={password} onChange={(e)=>(setp(e.target.value))}/><br/>
     <button class ="admin" type="submit">login</button>
    </form> 
    </div>
   )
}
export default AdminLogin