window.addEventListener("load", ()=>{
    
    fillTable(data)
})
function pagination(data){
    
}
function sortTable(data, colname, reverse = 1, isName = false){// reverse is for reverse sorting 
    // if reverse == 1 -> it will sort alphabetical
    // reverse == -1 -> reverse alphabetical 
    if(isName){
        data.sort((a,b)=>{
            if(a["name"][colname] < b["name"][colname]){
                return -1*reverse
            }
            if(a["name"][colname] > b["name"][colname]){
                return 1*reverse
            }
            return 0
        })
    }else{
        data.sort((a,b)=>{
            if(a[colname] < b[colname]){
                return -1*reverse
            }
            if(a[colname] > b[colname]){
                return 1*reverse
            }
            return 0
        })
    }
    // changing data and recreating table
    fillTable(data)
}
// function to fill table with data from JSON
function fillTable(data){
    let table = document.querySelector("#table")
    table.innerHTML = ""
    let colnames = ["Имя", "Фамилия", "Описание", "Цвет глаз"]
    let tr = document.createElement("tr")
    tr.classList.add("trow")
    let reverse = 1
    for(let col of colnames){
        
        let td = document.createElement("td")
        td.innerText = col
        td.classList.add("colname")
        
        td.addEventListener("dblclick", (e)=>{
            table.classList.toggle("sorted")
            reverse = (table.classList.contains("sorted"))?(-1):1
            if(e.target.innerText == "Цвет глаз"){
                sortTable(data, "eyeColor",reverse)
            }else if(e.target.innerText == "Описание"){
                sortTable(data, "about", reverse)
            }else if(e.target.innerText == "Имя"){
                sortTable(data,"firstName",reverse,true)
            }else if(e.target.innerText == "Фамилия"){
                sortTable(data, "lastName",reverse,true)
            }
        })  
        td.addEventListener("contextmenu", (e)=>{
            e.preventDefault()
            let cellIndex = Array.from(e.target.parentNode.children).indexOf(td)
            for(let i = 0; i < table.children.length-1; i++){
                table.children[i+1].children[cellIndex].classList.toggle("hidden")
            }
        })

        tr.appendChild(td)
    }
    table.appendChild(tr)

    let fullName = ["firstName", "lastName"]
    let filterData = ["about", "eyeColor"]
    for(let elem of data){ 
        let tr = document.createElement("tr")
        tr.classList.add("trow")
        for(let name of fullName){
            let td = document.createElement("td")
            td.classList.add("tcol")
            td.innerText = elem["name"][name]
            tr.appendChild(td)
            
        }// filling names of people
        for(let part of filterData){
            let td = document.createElement("td")
            td.classList.add("tcol") 
            
            if(part == "about"){
                td.classList.add("textOverflow") // for showing only 2 max lines
                td.innerText = elem[part]
            }else{
                let div = document.createElement("div")
                div.innerText = elem[part]
                div.style.backgroundColor = elem[part]
                td.style.color = "rgba(0,0,0,0)"
                div.style.width = "30px";
                div.style.height = "30px"
                div.style.borderRadius = "50%"
                div.style.margin = "0 auto"
                td.appendChild(div)
                td.classList.add("eyeColor")
            }
            tr.appendChild(td)
        }//filling other needed data of people
        table.appendChild(tr)
    }

    let tcols = document.getElementsByClassName("tcol")

    for(let td of tcols){

        td.addEventListener("click", ()=>{
            if(table.parentNode.children.length > 1){
                table.parentNode.removeChild(table.parentNode.children[1])
            }
            data = modal(td.parentElement, colnames,data)
        })
    }
}
function modal(tr,colnames,data){
    let dataCopy = []
    for (let key in data) {
        dataCopy[key] = data[key];
    }
    let main = document.getElementsByClassName("main")[0]
    let div = document.createElement("div")
    
    let textDiv = document.createElement("div")
    let names = ["firstName", "lastName","about", "eyeColor"]
    let otherData = []
    let col = 0
    for(let td of tr.children){
        let p = document.createElement("p")
        p.innerText = colnames[col]
        textDiv.appendChild(p)
        let textarea = document.createElement("textarea")
        textarea.classList.add(names[col])
        textarea.rows = 4
        textarea.style.width = "100%"
        textarea.innerText = td.innerText
        textDiv.appendChild(textarea)
        col++
    }
    div.appendChild(textDiv)
    let btns = ["Save", "Cancel"]
    let buttonDiv = document.createElement("div")

    let rowIndex = Array.from(document.getElementsByClassName("trow")).indexOf(tr)
    for(let btn of btns){
        let button = document.createElement("button")
        button.innerText = btn
        
        button.addEventListener("click", ()=>{
            if(btn[0] == "S"){
                let textareas = textDiv.getElementsByTagName("textarea")
                for(let index = 0; index < textareas.length; index++){
                    tr.children[index].innerText = textareas[index].value
                    if(textareas[index].className !== "firstName" && textareas[index].className !== "lastName"){
                        dataCopy[rowIndex-1][textareas[index].className] = textareas[index].value                
                    }else{
                        dataCopy[rowIndex-1]["name"][textareas[index].className] = textareas[index].value  
                    }
                }
                fillTable(dataCopy)
                main.removeChild(div)
            }if(btn[0] == "C"){
                main.removeChild(div)
            }
        })
        buttonDiv.appendChild(button)
    }
    buttonDiv.classList.add("btns")
    div.appendChild(buttonDiv)
    div.classList.add("modalWindow")
    main.appendChild(div)
    
    return dataCopy
}