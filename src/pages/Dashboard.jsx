import {useState,useEffect} from "react"
import {useNavigate} from "react-router-dom"
import "./style.css"
function Dashboard(){
    const [students,setstudents]=useState([])
     const nav=useNavigate()

    useEffect(()=>{
      fetch("http://localhost:8888/dashboard")
      .then((res)=>res.json())
      .then((data)=>setstudents(data))
      .catch((err)=>console.log(err))
    },[])
    const Delete=async(e)=>{
      const response =await fetch("http://localhost:8888/delete",{
      method:"DELETE",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({e})
      }
      )
      const result = await response.json()
      alert(result.message)
      setstudents((stu)=>stu.filter((s)=>s.s_id!=e))
    }
    return(
       <div>
         <h1>DASHBOARD</h1>
         <button class="add" onClick={()=> nav('/add')}>ADD</button>
         <table border="1">
             <thead>
                  <tr>
                    <th>ID</th>
                    <th>NAME</th>
                    <th>TOTAL</th>
                    <th>ACTION</th>
                  </tr>
              </thead>
              <tbody>
                  {students.map((s)=>(
                     <tr key={s.s_id}onClick={() => nav(`/student/${s.s_id}`)} style={{ cursor: "pointer" }}>
                         <td> {s.s_id}</td>
                         <td> {s.name}</td>
                         <td> {s.total}</td>
                         <td> <button class="hi" onClick={(e)=>{e.stopPropagation();Delete(s.s_id)}}>delete</button></td>
                     </tr>

                  ))}
               </tbody>
           </table>
          </div>
    )
   
}
export default Dashboard