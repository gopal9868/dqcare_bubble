import { raindropserver } from "../variables/env_var.js";
import { supporteddb } from "../variables/env_var.js";
const apiUrl=`${raindropserver}api/`;
const dbtype = document.getElementById("dbtype");
const supporteddbtype=`${supporteddb}`
var supportedList = supporteddbtype.split(',');
console.log(supportedList)
var isClicked = false;
dbtype.addEventListener('click',(e)=> {
    if(isClicked == false) {
    e.stopPropagation();
var dropList=''
supportedList.forEach(dbtype1=>{
    var tagType=`<option>${dbtype1}</option>`
    dropList=dropList+tagType
    var el = document.createElement("option");
    el.textContent = dbtype1;
    el.value = dbtype1;
    dbtype.appendChild(el);
})
};
 isClicked = true;}
);
const connection = document.getElementById("connCreate");
connection.addEventListener('click',e=>{
    e.preventDefault();
    const conname=document.querySelector("#conname").value;
    const dbname=document.querySelector("#dbname").value;
    const dbusername=document.querySelector("#dbusername").value;
    const dbpass=document.querySelector("#dbpass").value;
    const hostname=document.querySelector("#hostname").value;
    const dbtype=document.querySelector("#dbtype").value;
    var tcdata={}
    tcdata['connection_name']=conname;
    tcdata['db_name']=dbname;
    tcdata['db_user_name']=dbusername;
    tcdata['db_password']=dbpass;
    tcdata['db_host_name']=hostname;
    tcdata['db_type']=dbtype;
    var json = JSON.stringify(tcdata);
    postConnection(json).catch(err=>alert(err.message));

  })

  // functions below
  const postConnection=async (json) => {
    const rawResponse = await fetch(`${apiUrl}dbconnection/`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: json
    });
    
    var data=await rawResponse.json()
    var statusPost=rawResponse.status
   if(statusPost>300) {
     var msg=''
     for (var key of Object.keys(data)) {
      msg=msg+key + " -> " + data[key]+' '
  }
  alert(msg) 
       
   }
    if(rawResponse.status<300) {
     alert( "Connection created successfully")
    }
  };

  //Below is the event listener for connection search
  const conn_search = document.getElementById("conn_search");
  conn_search.addEventListener('click',e=>{
    e.preventDefault();
    const sconn_name=document.querySelector("#search_connname").value;
    var search_url=`${apiUrl}dbconnection/?search=${sconn_name}`
    //console.log(search_url)
    getconnection(search_url).catch(err=>alert(err.message));
     
  })

  const getconnection=async (search_url)=>{
    const response=await fetch(search_url);
    if (response.status>=300)
    { throw new Error("Resource not found"+response.statusText)}
    var data=await response.json();
    const tablearea=document.getElementById("connsearcharea")
    while (tablearea.firstChild) {
      tablearea.firstChild.remove()
  };
  const table_columns=['conn_name','db_name','db_user','db_password','db_host',
  'db_type']
  //console.log(table_columns);
   var s='<table id="table_1"><tr>'
    table_columns.forEach(row=> {
      var thTag=`<th>${row}</th>`
      s=s+thTag
      })
      s=s+`</tr></tr>`;
      var i=1
      
    if (data.length>0) {data.forEach(row => {
      var editId=`edit_${row['id']}`
      var deleteId=`delete_${row['id']}` 
      var tablerow=`<tr id="tablerow_${row['id']}"><td>${row['connection_name']}</td><td>${row['db_name']}</td>
      <td>${row['db_user_name']}</td><td>${row['db_password']}</td><td>${row['db_host_name']}</td>
      <td>${row['db_type']}</td>
      <td><button id="${editId}" class="btn btn-primary rowedit">edit</button></td>
      <td><button id="${deleteId}" class="btn btn-danger rowdelete">delete</button></td></tr>`
      s=s+tablerow
      i=i+1
  })}
  else {
  s=`<p> no result</p>`
  }
s=s+`</table>`
tablearea.innerHTML =s ;
//console.log(s)
     };
// Below is the event listner for delete and edit test cases
const tablearea1=document.getElementById("connsearcharea")
tablearea1.addEventListener('click',e=>{
 e.preventDefault();
 var index  = e.target.id.indexOf('_');
 const  dbid = e.target.id.substr(index+1);
 var clickedRow=document.getElementById(`tablerow_${dbid}`)
 

 //Below part will handle the delete
  if (e.target.id.match(/delete.*/)){
   //console.log(`tablerow_${dbid}`)
   var deleterow = document.getElementById(`tablerow_${dbid}`);
   deleterow.remove();
   deleteDbCall(dbid);
  }
 //Below part will handle the edits
 else if (e.target.id.match(/edit.*/)) {
    var editrow=document.getElementById(`tablerow_${dbid}`);
    //console.log(document.getElementById(`tablerow_${dbid}`).children)
    var newrow=''
    var i=0
    var res = Array.from(document.getElementById(`tablerow_${dbid}`).children);
    res.forEach(row=>{

      if (row.innerText.match(/edit.*/) )
      {
        var el=`<td><button type="button" id="searchsave_${dbid}" >Save</button></td>`
      }
      else if (row.innerText.match(/delete.*/) )
      {
        var el=`<td><button type="button" id="searchcancel_${dbid}" >Cancel</button></td>`
      }

      else if (i==5)
      {
        var el=`<td id="td_dbtype_${dbid}"><input type="text" id="mod_dbtype_${dbid}" value="${row.innerText}" ></td>`
      }
      else {
       var el=`<td><input type="text" value="${row.innerText}" ></td>`
      }
       newrow=newrow+el
       i=i+1
    })
     editrow.innerHTML=newrow
 }
 else if (e.target.id.match(/searchcancel.*/)){
   var cancelrow=document.getElementById(`tablerow_${dbid}`);
   //console.log(cancelrow)
   var newrow1=''
   //console.log(res)
    res.forEach(row1=>{
      //console.log(row1.innerText)
      if (row1.innerText.match(/delete.*/) )
      {
        var el1=`<td><button id="delete_${dbid}" class="btn btn-danger rowdelete">delete</button></td>`
      }
      else if (row1.innerText.match(/edit.*/) )
      {
        var el1=`<td><button id="edit_${dbid}" class="btn btn-primary rowedit">edit</button></td>`
      }
      else {
       var el1=`<td>${row1.innerText}</td>`
      }
       newrow1=newrow1+el1
    })
    //console.log(newrow1)
    cancelrow.innerHTML=newrow1
 }
 else if (e.target.id.match(/searchsave.*/)){
   var saverow=document.getElementById(`tablerow_${dbid}`);
   var eRes = Array.from(saverow.children)
   var econnname=eRes[0].firstChild.value;
   var edbname=eRes[1].firstChild.value;
   var edbuser=eRes[2].firstChild.value;
   var edbpassword=eRes[3].firstChild.value;
   var ehostname=eRes[4].firstChild.value;
   var edbtype=eRes[5].firstChild.value;
   var  etcdata={}
   etcdata['connection_name']=econnname;
   etcdata['db_name']=edbname;
   etcdata['db_user_name']=edbuser;
   etcdata['db_password']=edbpassword;
   etcdata['db_host_name']=ehostname;
   etcdata['db_type']=edbtype;
   var ejson = JSON.stringify(etcdata);
   putDbCall(dbid,ejson).then(response=>{
     alert(response)
     }).catch(err=>alert(err.message));
     var etablerow=`<td>${econnname}</td><td>${edbname}</td>
     <td>${edbuser}</td><td>${edbpassword}</td><td>${ehostname}</td>
     <td>${edbtype}</td>
     <td><button id="edit_${dbid}" class="btn btn-primary rowedit">edit</button></td>
     <td><button id="delete_${dbid}" class="btn btn-danger rowdelete">delete</button></td></tr>`
     saverow.innerHTML=etablerow;
 }
 else if (e.target.id.match(/mod_dbtype.*/)) {
var childEl=document.getElementById(e.target.id);
var parentEl=childEl.parentNode;
//console.log(childEl)
//console.log(childEl.parentNode)
var editdropList=`<select id="drop_dbtype_${dbid}">`
supportedList.forEach(dbtype1=>{
    tagType=`<option>${dbtype1}</option>`
    editdropList=editdropList+tagType
})
editdropList=editdropList+`</select>`
parentEl.innerHTML=editdropList
 }

 else{}
}
)
 

// delete function
const deleteDbCall=async(dbid)=> {
  fetch(`${apiUrl}dbconnection/${dbid}/`, {
  method: 'DELETE',}).then (alert("connection deleted successfully"))}
 
  const putDbCall=async(dbid,ejson)=> {
   const rawEdit= await fetch(`${apiUrl}dbconnection/${dbid}/`,{
     method:'PUT',
     headers:{
     'Content-Type':'application/json'
     },
     body:ejson
 });
 if(rawEdit.status>300) {
   throw new Error("Unable to update the connection, status code is "+rawEdit.status)
 }
 if(rawEdit.status<300) {
   return "connection updated successfully"
 }
 
  }

 
