import { raindropserver } from "../variables/env_var.js";
const apiUrl=`${raindropserver}api/`;
var dropDownIsClicked=false
var dropDownIsClickedTc=false
const appsearcharea = document.getElementById("appsearcharea");
const tcsearcharea = document.getElementById("tcsearcharea");
const appList = document.getElementById("app_search");
const searchCase=document.getElementById("tc_search");
const tcFullArea=document.getElementById("tcfullarea");
const scriptMArea=document.getElementById("scriptmarea");
searchCase.addEventListener('click',e=>{
    const searchString=document.querySelector("#tcappnames").value;
    e.preventDefault();
    gettestcasefull(searchString,'search')
})
appList.addEventListener('click',e=>{
    e.preventDefault();
    if (dropDownIsClicked==false) {getAppList(appsearcharea)}
})
 if(dropDownIsClicked) {
     //console.log("dropdown done")
 }
 appsearcharea.addEventListener('change',e=>{ 
    e.preventDefault();
     gettestcase(e.target.value,tcsearcharea)
 })

 tcsearcharea.addEventListener('change',e=>{ 
    e.preventDefault();

    //console.log("testcase selected")
    gettestcasefull(e.target.value)
     //gettestcase(e.target.value,tcsearcharea)
 })
 tcFullArea.addEventListener('click',e=>{
    if(e.target.id.match(/execute_.*/)) {
        console.log("exe clicked")
        var index  = e.target.id.indexOf('_');
  const  dbid = e.target.id.substr(index+1);
excuteTestCase(dbid)}
else if (e.target.id.match(/gen_script.*/)) {
    var etcdata={}
    var table = document.getElementById("table_1");
    for (var i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the 
        if(row.id.match(/tablerow_.*/))
             { var rowid=row.id.split("_")[1]
             var shdchk=`chkbox_${rowid}`
             var shdnum1=`numbox_${rowid}`
             var shdFlag=document.getElementById(shdchk)
             var shdNum=document.getElementById(shdnum1)
             console.log(shdFlag.checked)
             if(shdFlag.checked) {
                 etcdata[shdNum.value]=rowid
             }

             } 
        //for (var j = 0, col; col = row.cells[j]; j++) {

            //console.log(row.id)
          //iterate through columns
          //columns would be accessed using the "col" variable assigned in the for loop
       // }  
     }
    //console.log("gen script clicked")
    var ejson = JSON.stringify(etcdata);
    genPythonScheduleScript1(ejson)
}
else {}
  })



const getAppList=async(appsearcharea)=>{

    const response=await fetch(`${apiUrl}appname/`);
    if (response.status>=300)
    { throw new Error("Resource not found"+response.statusText)}
    var data= await response.json();
   // console.log(data)
    var dropList=`<select id="drop_aname"><option>--Select App--</option>`
    data.forEach(appname=>{
   var tagType=`<option>${appname['application_name']}</option>`
    dropList=dropList+tagType
  })
  dropList=dropList+`</select>`
  //console.log(dropList)
  appsearcharea.innerHTML=dropList
    dropDownIsClicked=true
    //console.log(appsearcharea)
}
const gettestcase=async (appname,tcsearcharea)=>{
    const response=await fetch(`${apiUrl}testcases/?appname=${appname}`);
  
    if (response.status>=300)
    { throw new Error("Resource not found"+response.statusText)}
    var data=await response.json();
    var dropList=`<br><p> Testcases</p><select id="drop_tcname"><option>--Select Testcase--</option> `
    data.forEach(data1=>{
       var  tagType=`<option>${data1['testcase_desc']}</option>`
    dropList=dropList+tagType
    })
    dropList=dropList+`</select>`
    //console.log(dropList)
    tcsearcharea.innerHTML=dropList
    dropDownIsClickedTc=true
    //console.log(tcsearcharea)
}

const gettestcasefull=async (testCaseName,searchType)=>{
    if (searchType=='search') {
        var search_url=`${apiUrl}testcases/?search=${testCaseName}`  
    }
    else {
    var search_url=`${apiUrl}testcases/?testcase_desc=${testCaseName}`} 

    //console.log(search_url)
    const response=await fetch(search_url);
    if (response.status>=300)
    { throw new Error("Resource not found"+response.statusText)}
    var data=await response.json();
    const tablearea=document.getElementById("tcfullarea")
    while (tablearea.firstChild) {
      tablearea.firstChild.remove()
  };
  const table_columns=['App_name','Testcase_Name','Source_Query','Target_Query','Source_Conn_Name',
  'Target_Conn_Name','Update_Date','Action','Status']
  //console.log(table_columns);
   var s='<table id="table_1" class="table-hover table-bordered"><tr>'
    table_columns.forEach(row=> {
      var thTag=`<th class="table-info">${row}</th>`
      s=s+thTag
      })
      s=s+`</tr></tr>`;
      var i=1
    data.forEach(row => {
      var editId=`${row['id']}`
      var deleteId=`delete_${row['id']}`
      var vstatus='Ready'
      var tablerow=`<tr id="tablerow_${row['id']}"><td id="appname_${row['id']}">${row['appname']}</td><td>${row['testcase_desc']}</td>
      <td>${row['source_query']}</td><td>${row['target_query']}</td><td id="srcconame_${row['id']}">${row['source_connection_name']}</td>
      <td id="tgtconame_${row['id']}">${row['target_connection_name']}</td>
      <td>${row['change_date'].split('.')[0].replace('T',' ')}</td>
      <td><button id="execute_${editId}" class="btn btn-primary rowedit">Execute</button></td>
      <td id="stat_${row['id']}">${vstatus}</td>
      </tr>`
      s=s+tablerow
      i=i+1
  });
s=s+`</table>`
tablearea.innerHTML =s ;
//console.log(s)
     };
const excuteTestCase=async(dbid)=>{
    console.log(dbid)
    const status = document.getElementById(`stat_${dbid}`)
    status.innerText = 'Running';
    status.style.color = 'blue';
    const response=await fetch(`${apiUrl}execute_tc/${dbid}`)
    console.log(response.status)
    if (response.status<300) {
      status.innerText = 'Completed';
      status.style.color = 'green';
    }
    if (response.status>=300)
    {       status.innerHTML = `<button id="error_${dbid}" class="btn btn-danger">Error</button>`;
             status.style.color = 'red';
             const error_m = document.getElementById(`error_${dbid}`);
             error_m.addEventListener('click',e=>{
              e.preventDefault();
              //console.log("error clicked")
             alert(response.statusText)
          })
       throw new Error("Resource not found"+response.statusText)}
   var  message=await response.text()
    console.log(message)
}
const genPythonScheduleScript=async()=>{
    const response=await fetch(`${apiUrl}generate_schedule/`)
    if (response.status>=300)
    { throw new Error("Resource not found"+response.statusText)}
    var message=await response.text()
    console.log(message)
    

}

const genPythonScheduleScript1=async (json) => {
    const rawResponse = await fetch(`${apiUrl}generate_schedule/`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: json
    });
    if(rawResponse.status>300) {
      throw new Error("Unable to create the schedule script, status code is "+rawResponse.status)
    }
    if(rawResponse.status<300) {
      var  message=await rawResponse.text()
        scriptMArea.innerHTML=message
    }
    //const content = await rawResponse.json();
  };
