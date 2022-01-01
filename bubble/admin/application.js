import { raindropserver } from "../variables/env_var.js";
const apiUrl=`${raindropserver}api/`;
console.log(apiUrl)
const application = document.getElementById("appCreate");
application.addEventListener('click',e=>{
    e.preventDefault();
    const appame=document.querySelector("#appname").value;
    const appdom=document.querySelector("#appdom").value;
    const appown=document.querySelector("#appown").value;
    const ptdl=document.querySelector("#ptdl").value;
    var tcdata={}
    tcdata['application_name']=appame;
    tcdata['application_domain']=appdom;
    tcdata['application_owner']=appown;
    tcdata['application_team_dl']=ptdl;
    var json = JSON.stringify(tcdata);
    postApplication(json).catch(err=>alert(err.message));

  })

  // functions below
  const postApplication=async (json) => {
    const rawResponse = await fetch(`${apiUrl}application/`, {
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
     alert( "Application created successfully")
    }
  };

  //Below is the event listener for connection search
  const app_search = document.getElementById("app_search");
  app_search.addEventListener('click',e=>{
    e.preventDefault();
    const sapp_name=document.querySelector("#search_appname").value;
    var search_url=`${apiUrl}application/?search=${sapp_name}`
    console.log(search_url)
    getApplication(search_url).catch(err=>alert(err.message));
     
  })

  const getApplication=async (search_url)=>{
    const response=await fetch(search_url);
    if (response.status>=300)
    { throw new Error("Resource not found"+response.statusText)}
    var data=await response.json();
    const tablearea=document.getElementById("appsearcharea")
    while (tablearea.firstChild) {
      tablearea.firstChild.remove()
  };
  const table_columns=['app_name   ','app_domain  ','app_owner  ','app_team_dl  ','change_date  ']
  //console.log(table_columns);
   var s='<table id="table_main"><tr>'
    table_columns.forEach(row=> {
      var thTag=`<th class="thead">${row}</th>`
      s=s+thTag
      })
      s=s+`</tr></tr>`;
      var i=1
      
    if (data.length>0) {data.forEach(row => {
      //console.log(row['change_date'])
     
      var editId=`edit_${row['id']}`
      var deleteId=`delete_${row['id']}` 
      var tablerow=`<tr id="tablerow_${row['id']}"><td>${row['application_name']}</td><td>${row['application_domain']}</td>
      <td>${row['application_owner']}</td><td>${row['application_team_dl']}</td><td>${row['change_date'].split('.')[0].replace('T',' ')}</td>
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
const tablearea1=document.getElementById("appsearcharea")
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

      else {
       var el=`<td><input type="text" value="${row.innerText}" ></td>`
      }
       newrow=newrow+el
     
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
   var eappname=eRes[0].firstChild.value;
   var edomname=eRes[1].firstChild.value;
   var eowner=eRes[2].firstChild.value;
   var eptdl=eRes[3].firstChild.value;
   var echange=eRes[4].firstChild.value;
   var etcdata={}
    etcdata['application_name']=eappname;
   etcdata['application_domain']=edomname;
   etcdata['application_owner']=eowner;
   etcdata['application_team_dl']=eptdl;
   var ejson = JSON.stringify(etcdata);
   putDbCall(dbid,ejson).then(response=>{
     alert(response)
     }).catch(err=>alert(err.message));
     var etablerow=`<td>${eappname}</td><td>${edomname}</td>
     <td>${eowner}</td><td>${eptdl}</td><td>${echange}</td>
     <td><button id="edit_${dbid}" class="btn btn-primary rowedit">edit</button></td>
     <td><button id="delete_${dbid}" class="btn btn-danger rowdelete">delete</button></td></tr>`
     saverow.innerHTML=etablerow;
 }
 else{}
}
)
 

// delete function
const deleteDbCall=async(dbid)=> {
  fetch(`${apiUrl}application/${dbid}/`, {
  method: 'DELETE',}).then (alert("application deleted successfully"))}
 
  const putDbCall=async(dbid,ejson)=> {
   const rawEdit= await fetch(`${apiUrl}application/${dbid}/`,{
     method:'PUT',
     headers:{
     'Content-Type':'application/json'
     },
     body:ejson
 });
 if(rawEdit.status>300) {
   throw new Error("Unable to update the application, status code is "+rawEdit.status)
 }
 if(rawEdit.status<300) {
   return "application updated successfully"
 }
 
  }

 
