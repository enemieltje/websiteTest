import GLTFViewer from './GLTFViewer.js'

const optionSelectDiv = document.createElement("div");
document.body.appendChild(optionSelectDiv);
let glbFiles = [];
let optionArray

GLTFViewer.start()

function httpGetAsync(url, callback) {
    console.log(`GET: ${url}`)
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
        {
            console.log(`Response: `)
            console.log(JSON.parse(xmlHttp.responseText))
            callback(xmlHttp.responseText);
        }
    }
    xmlHttp.open("GET", url, true); // true for asynchronous
    xmlHttp.send(null);
}

httpGetAsync("/getGLB", (responseText) => {
    glbFiles = JSON.parse(responseText)
    httpGetAsync("/getOptions", (responseText) => {
        optionArray = JSON.parse(responseText)
        start();
    })
})

function start() {
    optionArray.forEach((optionSet, i) => {
        const select = document.createElement("select");
        select.id = i;
        select.addEventListener('change', optionCallback)

        optionSet.forEach((optionText, i) => {
            const option = document.createElement("option");
            option.text = optionText;
            option.id = i;
            select.add(option)
        })

        if (optionSet.length == 1) select.style.display = "none";

        optionSelectDiv.append(select)
    });
    optionCallback()
}

function optionCallback(e) {
    let fileName = ""

    for (const select of optionSelectDiv.children)
    {
        fileName += select.value
        fileName += " "
    }
    fileName = fileName.slice(0, -1)
    GLTFViewer.loadGltf(fileName)

    for (const select of optionSelectDiv.children)
    {
        if (select.children.length > 1) update(select, fileName)
    }
}

/**
 *
 * @param {Element} select
 * @param {string} fileName
 */
function update(select, fileName) {
    fileName = fileName.replace(/  /g, " ")
    let regExString = fileName.replace(select.value, "(\\S*)")
    regExString = regExString.replace(".", "\\.");
    let regex = new RegExp(regExString);
    let enabledArray = []

    glbFiles.forEach((fileName) => {
        const regExpExecArray = regex.exec(fileName)
        if (!regExpExecArray) return
        const id = optionArray[select.id].indexOf(regExpExecArray[1])
        enabledArray[id] = true
    })

    for (const option of select.children)
    {
        option.style.display = enabledArray[option.id] ? "block" : "none"
    }
}
