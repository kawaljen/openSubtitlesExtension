
///////////////////////----------------- --------------------/////////////////////////
const apiKey = "lS3YWNgV0nEWgmcCZcEZMz3WZfJK3xZN";
const credential = {'username': 'kawaljen','password': 'x#j2c9dpSM@nT' }

const urlFormat = "https://api.opensubtitles.com/api/v1/infos/formats";
const urlInfoUSer ="https://api.opensubtitles.com/api/v1/infos/user";
const urlLogin ="https://api.opensubtitles.com/api/v1/login";
const urlDownload= 'https://api.opensubtitles.com/api/v1/download';

const urlSearch = "https://api.opensubtitles.com/api/v1/subtitles?" 
var  sessionToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJRUmtHc0pLZEZVV2hrNEh0VlozVjFVYVB4U0RtbWZ4RSIsImV4cCI6MTcxMjEzNTIxNX0.thnspGwDJ11hsAV_xhyo89ds2PE_SB8aPonK_iaC5QE";

const $responseBlock = document.getElementById("response");
var compt=0



///////////////////////-----------------Queries --------------------/////////////////////////

async function postData(url = "", data = {}) {
    try {
        const response = await fetch(url, {
                                method: 'POST',
                                headers: {
                                    'Accept': 'application/json',
                                    "Content-Type": "application/json",
                                    'Api-Key':apiKey ,
                                    'User-Agent': 'NAME v1'        
                                },    
                                body: JSON.stringify(data), 
        })

        if (!response.ok) {
            const message = `An error has occured: ${response.status}`;
            throw new Error(message);
          }
        return await response.json();

    } catch (error) {
        console.log(error);
    }
  }

  async function getWithToken(url = "", param) {
    if (sessionToken !== null ) { await getToken() }
    try {
        const response = await fetch(url+param, {
            headers: {
                'Api-Key': apiKey,
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ sessionToken,
              },  
        })

        if (!response.ok) {
            const message = `An error has occured: ${response.status}`;
            throw new Error(message);
          }
        return await response.json();
    } catch (error) {
        console.log(error);
    }
  }


  async function postWithToken (url='', data={}){
    if (sessionToken !== null ) { await getToken() }
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
            'Api-Key': 'lS3YWNgV0nEWgmcCZcEZMz3WZfJK3xZN',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+ sessionToken
            },
            body: JSON.stringify(data)
        })
        if (!response.ok) {
            const message = `An error has occured: ${response.status}`;
            throw new Error(message);
        }
        return await response.json();
    } catch (error) {
        console.log(error);
    }

  }
  

///////////////////////-----------------sortData --------------------/////////////////////////


function sortData (oldList){
    compt=0;
    let newLList=[];
    for (let i= 0; i< oldList.length; i++){
        newLList.push({ 'id': oldList[i].id , 'name': oldList[i].attributes.release })
    }
    return newLList;
}

function cleanQuery (query){
    if( query.length <=2 ){ 
        $responseBlock.innerHTML = "query too short"; 
        return e.preventDefault
    }
    return query = query.toLowerCase().replace(/[\s\.]/g, "+")
}

async function getToken (){
    let resp = await postData(urlLogin, credential);
    sessionToken = resp.token;
    return await (sessionToken)
}


///////////////////////-----------------Print --------------------/////////////////////////
var subtitleList;
function printSearchResult (idList){
    if(idList.length<1){
        $responseBlock.innerHTML ='no result found'
        return
    }

    subtitleList = document.createElement("ul");

    getLinks(idList)
    
}

function getLinks(idList){
    subtitleList = document.createElement("ul");
    compt2 = compt+5 <= idList.length? compt+5 : idList.length;
    for (let i = compt ; i <compt2; i++){

        var subtitleItem = document.createElement("li");
        subtitleItem.innerText = idList[i].name

        var subtitleButton = document.createElement("button");
        subtitleButton.innerText = "Get the url";
        subtitleButton.setAttribute('data-id' , idList[i].id)
        subtitleButton.addEventListener("click", async function() {
            let resp = await postWithToken (urlDownload, {'file_id':this.getAttribute('data-id')});
            navigator.clipboard.writeText(resp.link)
            //   .then(function() {
            //     subtitleButton.innerHTML = "copied !"
            //   })
            //   .catch(function() {
            //     subtitleButton.innerHTML = "Error copying URL to clipboard";
            //   });

            this.innerHTML = "copied !"
          });

          subtitleItem.appendChild(subtitleButton);
          subtitleList.appendChild(subtitleItem);
    }
    compt=compt2;
    $responseBlock.appendChild(subtitleList);
    // if(compt2 !== idList.length){ 
    //     $responseBlock 
    // }

}

///////////////////////-----------------Interaction --------------------/////////////////////////

document.getElementById("button2").onclick = function() {postData(urlLogin, credential)};

document.getElementById("search").onclick  = async function(e) {
    let query = cleanQuery (document.getElementById("searchBox").value)    
    let resp = await getWithToken (urlSearch, 'languages=en&query='+ query);
    let idList = sortData (resp.data)
    printSearchResult(idList);
};

