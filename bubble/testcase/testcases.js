import { raindropserver } from "../variables/env_var.js";
import { supporteddb } from "../variables/env_var.js";
const supporteddbtype=`${supporteddb}`
const apiUrl=`${raindropserver}api/`;
var supportedList = supporteddbtype.split(',');
//drop down for app name
const dropDownAppname = document.getElementById("tcappname");
var dropDownIsClicked=false
dropDownAppname.addEventListener('click',e=>{
  if(dropDownIsClicked == false) {
  e.stopPropagation();
getAppList(dropDownAppname)
//console.log(supportedList)
};
dropDownIsClicked=true;})

// drop down for result type
const dropDownResultType = document.getElementById("tctype");
var dropDownRTIsClicked=false
dropDownResultType.addEventListener('click',e=>{
  if(dropDownRTIsClicked == false) {
  e.stopPropagation();
getRTList(dropDownResultType)
//console.log(supportedList)
};
dropDownRTIsClicked=true;})

//below is the event listner to add new testcases
const testcase = document.getElementById("tc_create");
testcase.addEventListener('click',e=>{
    e.preventDefault();
    const appname=document.querySelector("#tcappname").value;
    const resulttype=document.querySelector("#tctype").value;
    const tcdesc=document.querySelector("#tcdesc").value;
    const srcqry=document.querySelector("#srcqry").value;
    const tgtqry=document.querySelector("#tgtqry").value;
    const srcconn=document.querySelector("#srcconn").value;
    const tgtconn=document.querySelector("#tgtconn").value;
    const srctname=document.querySelector("#srctname").value;
    const tgttname=document.querySelector("#tgttname").value;
    const pkcolumn=document.querySelector("#pkcolumn").value;
    //console.log(appname)
    var tcdata={}
    tcdata['appname']=appname;
    tcdata['result_type']=resulttype;
    tcdata['testcase_desc']=tcdesc;
    tcdata['source_query']=srcqry;
    tcdata['target_query']=tgtqry;
    tcdata['source_connection_name']=srcconn;
    tcdata['target_connection_name']=tgtconn;
    tcdata['source_table_name']=srctname;
    tcdata['target_table_name']=tgttname;
    tcdata['pk_column']=pkcolumn;
    var json = JSON.stringify(tcdata);
    postdata(json).then(response=>{
    alert(response)
    }).catch(err=>alert(err.message));

  })
  //Below is the event listener for Testcase search
  const tc_search = document.getElementById("tc_search");
  tc_search.addEventListener('click',e=>{
    e.preventDefault();
    const s_appname=document.querySelector("#tcappnames").value;
    var search_url=`${apiUrl}testcases/?search=${s_appname}`
    //console.log(search_url)
    gettestcase(search_url).catch(err=>alert(err.message));
     
  })
  // Below is the event listner for delete and edit test cases
  const tablearea1=document.getElementById("searcharea")
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
       //console.log(row.id)
       if (row.innerText.match(/edit.*/) )
       {
         var el=`<td><button type="button" id="searchsave_${dbid}" >Save</button></td>`
       }
       else if (row.innerText.match(/delete.*/) )
       {
         var el=`<td><button type="button" id="searchcancel_${dbid}" >Cancel</button></td>`
       }
       else if (row.id.match(/appname_.*/))
       {
         var el=`<td id="td_app_${dbid}"><input type="text" id="mod_app_${dbid}" value="${row.innerText}" ></td>`
       }
       else if (row.id.match(/restype_.*/))
       {
         var el=`<td id="td_res_${dbid}"><input type="text" id="mod_res_${dbid}" value="${row.innerText}" ></td>`
       }

       else if (row.id.match(/srcconame_.*/))
       {
         var el=`<td id="td_srconame_${dbid}"><input type="text" id="mod_srconame_${dbid}" value="${row.innerText}" ></td>`
       }

       else if (row.id.match(/tgtconame_.*/))
       {
         var el=`<td id="td_tgtconame_${dbid}"><input type="text" id="mod_tgtconame_${dbid}" value="${row.innerText}" ></td>`
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
    newrow1=''
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
    var erestype=eRes[1].firstChild.value;
    //console.log(eappname)
    var etcdesc=eRes[2].firstChild.value;
    var esrcqry=eRes[3].firstChild.value;
    var etgtqry=eRes[4].firstChild.value;
    var esrcconn=eRes[5].lastChild.value;
    var etgtconn=eRes[6].lastChild.value;
    var esrctname=eRes[7].firstChild.value;
    var etgttname=eRes[8].firstChild.value;
    var echangedt=eRes[9].firstChild.value;
    var epkcolumn=eRes[10].firstChild.value;
    var etcdata={}
    etcdata['appname']=eappname;
    etcdata['result_type']=erestype;
    etcdata['testcase_desc']=etcdesc;
    etcdata['source_query']=esrcqry;
    etcdata['target_query']=etgtqry;
    etcdata['source_connection_name']=esrcconn;
    etcdata['target_connection_name']=etgtconn;
    etcdata['source_table_name']=esrctname;
    etcdata['target_table_name']=etgttname;
    etcdata['change_date']=echangedt;
    etcdata['pk_column']=epkcolumn;
    var ejson = JSON.stringify(etcdata);
    console.log(ejson)
    putDbCall(dbid,ejson).then(()=>{
      alert("test case updated")
      }).catch(err=>alert(err.message));
      var etablerow=`<td id="appname_${dbid}">${eappname}</td><td id="restype_${dbid}">${erestype}</td><td>${etcdesc}</td>
      <td>${esrcqry}</td><td>${etgtqry}</td><td id="srcconame_${dbid}">${esrcconn}</td>
      <td id="tgtconame_${dbid}">${etgtconn}</td><td>${esrctname}</td><td>${etgttname}</td><td>${echangedt}</td><td>${epkcolumn}</td>
      <td><button id="edit_${dbid}" class="btn btn-primary rowedit">edit</button></td>
      <td><button id="delete_${dbid}" class="btn btn-danger rowdelete">delete</button></td></tr>`
      saverow.innerHTML=etablerow;
  }
  else if (e.target.id.match(/mod_app_.*/)){
    var childEl=document.getElementById(e.target.id);
var parentEl=childEl.parentNode;  
//console.log(parentEl)
getAppList(parentEl,dbid)
  }

  else if (e.target.id.match(/mod_res_.*/)){
    var childEl=document.getElementById(e.target.id);
var parentEl=childEl.parentNode;
//console.log(parentEl)
getRTList(parentEl,dbid)
  }

  else if (e.target.id.match(/mod_srconame_.*/)){
    var childEl=document.getElementById(e.target.id);
var parentEl=childEl.parentNode;
var dropList=`<select id="drop_scname_${dbid}">`
supportedList.forEach(dbtype1=>{
    var tagType=`<option>${dbtype1}</option>`
    dropList=dropList+tagType
})
dropList=dropList+`</select>`
parentEl.innerHTML=dropList
//console.log(parentEl)
//getAppList(parentEl,dbid)
  }

  else if (e.target.id.match(/mod_tgtconame_.*/)){
    childEl=document.getElementById(e.target.id);
parentEl=childEl.parentNode;
var dropList=`<select id="drop_tcname_${dbid}">`
supportedList.forEach(dbtype1=>{
    var tagType=`<option>${dbtype1}</option>`
    dropList=dropList+tagType
})
dropList=dropList+`</select>`
parentEl.innerHTML=dropList
//console.log(parentEl)
//getAppList(parentEl,dbid)
  }
  else{}
}
 )
// event listerner for source conn in search
tablearea1.addEventListener('change',e=>{

  if (e.target.id.match(/drop_scname.*/)){

  getModConnection(e.target.value).then(response=>response.json()).then(
    data=>{
      const parent= document.getElementById(e.target.id).parentNode
      try {
        const selectListRemove=document.getElementById('eselect')
        selectListRemove.remove()
      }
      catch{

      }
      var selectList = document.createElement("select");
     selectList.id = `eselect`;
     parent.appendChild(selectList);
     data.forEach(data1=>{
        var option = document.createElement("option");
        option.value = data1['connection_name'];
        option.text = data1['connection_name'];
        console.log(data1)
        selectList.appendChild(option);
     
    })})
}
else if (e.target.id.match(/drop_tcname.*/)){

  getModConnection(e.target.value).then(response=>response.json()).then(
    data=>{
      const parent= document.getElementById(e.target.id).parentNode
      try {
        const selectListRemove=document.getElementById('eselecttgt')
        selectListRemove.remove()
      }
      catch{

      }
      var selectList = document.createElement("select");
     selectList.id = `eselecttgt`;
     parent.appendChild(selectList);
     data.forEach(data1=>{
        var option = document.createElement("option");
        option.value = data1['connection_name'];
        option.text = data1['connection_name'];
        console.log(data1)
        selectList.appendChild(option);
     
    })})
}
}
)
//  source conn name drop down
const srcconntyp = document.getElementById("srcconntyp");
var isClicked = false;
srcconntyp.addEventListener('click',(e)=> {
    if(isClicked == false) {
    e.stopPropagation();
var dropList=''
supportedList.forEach(dbtype1=>{
    var tagType=`<option>${dbtype1}</option>`
    dropList=dropList+tagType
    var el = document.createElement("option");
    el.textContent = dbtype1;
    el.value = dbtype1;
    srcconntyp.appendChild(el);
})
};
 isClicked = true;}
);  
srcconntyp.addEventListener('change',(e)=> {
  const srcconn= document.getElementById("srcconn");
  getConnection(e.target.value,srcconn);

})
// Target connection drop down
const tgtconntyp = document.getElementById("tgtconntyp");
var isClickedTgt = false;
tgtconntyp.addEventListener('click',(e)=> {
    if(isClickedTgt == false) {
    e.stopPropagation();
var dropList=''
supportedList.forEach(dbtype1=>{
    var tagType=`<option>${dbtype1}</option>`
    dropList=dropList+tagType
    var el = document.createElement("option");
    el.textContent = dbtype1;
    el.value = dbtype1;
    tgtconntyp.appendChild(el);
})
};
isClickedTgt = true;}
);  
tgtconntyp.addEventListener('change',(e)=> {
  const tgtconn= document.getElementById("tgtconn");
  getConnection(e.target.value,tgtconn);

})
  
  // write all the new functions below
  // Test cases search function and rendering

  const gettestcase=async (search_url)=>{
    const response=await fetch(search_url);
    if (response.status>=300)
    { throw new Error("Resource not found"+response.statusText)}
    var data=await response.json();
    const tablearea=document.getElementById("searcharea")
    while (tablearea.firstChild) {
      tablearea.firstChild.remove()
  };
  const table_columns=['App_Name','Result_Type','Testcase_Name','Source_Query','Target_Query','Source_Conn_Name',
  'Target_Conn_Name','Source_Table_Name','Target_Table_Name','Update_Date','Primary_Key','Edit','Delete']
  //console.log(table_columns);
   var s='<table id="table_1" class="table table-hover table-bordered"><tr>'
    table_columns.forEach(row=> {
      var thTag=`<th class="table-info">${row}</th>`
      s=s+thTag
      })
      s=s+`</tr></tr>`;
      var i=1
    data.forEach(row => {
      var editId=`edit_${row['id']}`
      var deleteId=`delete_${row['id']}` 
      var tablerow=`<tr id="tablerow_${row['id']}"><td id="appname_${row['id']}">${row['appname']}</td>
      <td id="restype_${row['id']}">${row['result_type']}</td><td>${row['testcase_desc']}</td>
      <td>${row['source_query']}</td><td>${row['target_query']}</td><td id="srcconame_${row['id']}">${row['source_connection_name']}</td>
      <td id="tgtconame_${row['id']}">${row['target_connection_name']}</td><td>${row['source_table_name']}</td><td>${row['target_table_name']}</td>
      <td>${row['change_date'].split('.')[0].replace('T',' ')}</td><td>${row['pk_column']}</td>
      <td><button id="${editId}" class="btn btn-primary rowedit">edit</button></td>
      <td><button id="${deleteId}" class="btn btn-danger rowdelete">delete</button></td></tr>`
      s=s+tablerow
      i=i+1
  });
s=s+`</table>`
tablearea.innerHTML =s ;
//console.log(s)
     };
//below is the post api call fucntion to create test cases
     const postdata=async (json) => {
      const rawResponse = await fetch(`${apiUrl}testcases/`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: json
      });
      if(rawResponse.status>300) {
        throw new Error("Unable to create the testcase, status code is "+rawResponse.status)
      }
      if(rawResponse.status<300) {
        return "Test case created successfully"
      }
      //const content = await rawResponse.json();
    };

// delete function
const deleteDbCall=async(dbid,ejson)=> {
 fetch(`${apiUrl}testcases/${dbid}/`, {
 method: 'DELETE',}).then (alert("test cases deleted successfully"))}

 const putDbCall=async(dbid,ejson)=> {
  const rawEdit= await fetch(`${apiUrl}testcases/${dbid}/`,{
    method:'PUT',
    headers:{
    'Content-Type':'application/json'
    },
    body:ejson
});
if(rawEdit.status>300) {
  throw new Error("Unable to update the testcase, status code is "+rawEdit.status)
}
if(rawEdit.status<300) {
  return "Test case updated successfully"
}

 }

 //Function to fetch the app list and make drop down list
 const getAppList=async(dropDownAppname,dbid)=>{

  const response=await fetch(`${apiUrl}appname/`);
  if (response.status>=300)
  { throw new Error("Resource not found"+response.statusText)}
  const data= await response.json();
  var dropList=`<select id="drop_aname_${dbid}">`
  data.forEach(appname=>{
 var tagType=`<option>${appname['application_name']}</option>`
  dropList=dropList+tagType
})
dropList=dropList+`</select>`
//console.log(dropList)
dropDownAppname.innerHTML=dropList}

// function to fetch result type drop down
const getRTList=async(dropDownRT,dbid)=>{

  const response=await fetch(`${apiUrl}resulttype/`);
  if (response.status>=300)
  { throw new Error("Resource not found"+response.statusText)}
  const data= await response.json();
  var dropList=`<select id="drop_rtname_${dbid}">`
  data.forEach(rt=>{
 var tagType=`<option>${rt['result_type']}</option>`
  dropList=dropList+tagType
})
dropList=dropList+`</select>`
//console.log(dropList)
dropDownRT.innerHTML=dropList}


const getConnection=async(dbtype,srcconn)=>{
  const response=await fetch(`${apiUrl}connname/?db_type=${dbtype}`);
  if (response.status>=300)
  { throw new Error("Resource not found"+response.statusText)}
  const data= await response.json();
  var dropList=''
  data.forEach(appname=>{
 var tagType=`<option>${appname['connection_name']}</option>`
  dropList=dropList+tagType
})
srcconn.innerHTML=dropList
}

// modification connection drop down
const getModConnection=async(dbtype)=>{
  const response=await fetch(`${apiUrl}connname/?db_type=${dbtype}`);
  if (response.status>=300)
  { throw new Error("Resource not found"+response.statusText)}
 return response
}
