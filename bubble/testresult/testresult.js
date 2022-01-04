import { raindropserver } from "../variables/env_var.js";
const apiUrl=`${raindropserver}api/`
console.log(apiUrl)
var dropDownIsClicked=false
var dropDownIsClickedTc=false
const appsearcharea = document.getElementById("appsearcharea");
const tcsearcharea = document.getElementById("tcsearcharea");
const appList = document.getElementById("app_search");
const searchCase=document.getElementById("tc_search");
const tcFullArea=document.getElementById("tcfullarea");
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
     //gettestcase(e.target.value,tcsearcharea)
     console.log(e.target.value)
     gettestcasefull(e.target.value)
 })

 tcsearcharea.addEventListener('change',e=>{ 
    e.preventDefault();

    //console.log("testcase selected")
    gettestcasefull(e.target.value)
     //gettestcase(e.target.value,tcsearcharea)
 })



const getAppList=async(appsearcharea)=>{
    //console.log(`${apiUrl}appname/`)
    const response=await fetch(`${apiUrl}appname/`);
    if (response.status>=300)
    { throw new Error("Resource not found"+response.statusText)}
    const data= await response.json();
   console.log(data)
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
/*const gettestcase=async (appname,tcsearcharea)=>{
    const response=await fetch(`${apiUrl}testcases/?appname=${appname}`);
    if (response.status>=300)
    { throw new Error("Resource not found"+response.statusText)}
    data=await response.json();
    var dropList=`<br><p> Testcases</p><select id="drop_tcname"><option>--Select Testcase--</option> `
    data.forEach(data1=>{
        tagType=`<option>${data1['testcase_desc']}</option>`
    dropList=dropList+tagType
    })
    dropList=dropList+`</select>`
    //console.log(dropList)
    tcsearcharea.innerHTML=dropList
    dropDownIsClickedTc=true
    //console.log(tcsearcharea)
}*/

const gettestcasefull=async (testCaseName,searchType)=>{
    if (searchType=='search') {
        var search_url=`${apiUrl}tcresultview/?search=${testCaseName}`  
    }
    else {
    var     search_url=`${apiUrl}tcresultview/?appname=${testCaseName}`} 

    console.log(search_url)
    const response=await fetch(search_url);
    if (response.status>=300)
    { throw new Error("Resource not found"+response.statusText)}
    var data=await response.json();
    const tablearea=document.getElementById("tcfullarea")
    while (tablearea.firstChild) {
      tablearea.firstChild.remove()
  };
  const table_columns=['App_Name','Testcase_Name','Source_Result','Target_Result','Result_Desc','Capture_Date']
  //console.log(table_columns);
   var s='<table id="table_1" class="table table-hover table-bordered"><tr>'
    table_columns.forEach(row=> {
      var thTag=`<th class="table-info">${row}</th>`
      s=s+thTag
      })
      s=s+`</tr></tr>`;
      var i=1
    data.forEach(row => {
      var editId=`${row['id']}`
      var deleteId=`delete_${row['id']}` 
      var tablerow=`<tr id="tablerow_${row['id']}"><td id="appname_${row['id']}">${row['appname']}</td><td>${row['testcase_desc']}</td>
      <td>${row['source_result']}</td><td>${row['target_result']}</td><td id="srcconame_${row['id']}">${row['result_desc']}</td>
      <td>${row['change_date'].split('.')[0].replace('T',' ')}</td></tr>`
      s=s+tablerow
      i=i+1
  });
s=s+`</table>`
tablearea.innerHTML =s ;
//console.log(s)
     };
