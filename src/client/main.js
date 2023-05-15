import GLTFViewer from './GLTFViewer.js'

const optionSelectDiv = document.createElement("div");
document.body.appendChild(optionSelectDiv);
let glbFiles = [];
let optionObject;
let motorManager

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

// httpGetAsync("/getGLB", (responseText) => {
//     glbFiles = JSON.parse(responseText)
//     httpGetAsync("/getOptions", (responseText) => {
//         optionArray = JSON.parse(responseText)
//         start();
//     })
// })

httpGetAsync("/getMotorManager", (responseText) => {
    motorManager = JSON.parse(responseText);
    start();
})

function start() {
    Object.keys(motorManager.optionObject).forEach((optionName, i) => {
        const optionSet = motorManager.optionObject[optionName]
        const select = document.createElement("select");
        select.id = i;
        select.addEventListener('change', optionCallback)

        optionSet.forEach((optionText, i) => {
            const option = document.createElement("option");
            option.text = optionText;
            option.id = i;
            if (optionText === "") option.label = "none"
            select.add(option)
        })

        if (optionSet.length == 1) select.style.display = "none";

        optionSelectDiv.append(select)
    });
    optionCallback()
}

function optionCallback(e) {
    let motorName = ""
    const motorOptions = {}
    const optionArray = Object.keys(motorManager.optionObject)

    for (const select of optionSelectDiv.children)
    {
        motorName += select.value
        motorName += " "
    }
    motorName = motorName.slice(0, -1)
    GLTFViewer.loadGltf(motorName)

    optionArray.forEach((optionName, i) => {
        const select = optionSelectDiv.children.item(i)
        motorOptions[optionName] = select.value;
    })
    optionArray.forEach((optionName, i) => {
        const select = optionSelectDiv.children.item(i)
        if (select.children.length > 1) update(select, motorOptions, optionName)
    })
}

/**
 *
 * @param {Element} select
 * @param {string} motorName
 */
function update(select, motorOptions, optionName) {
    let regExString = ""

    Object.keys(motorManager.optionObject).forEach((_optionName, i) => {
        if (i) regExString += " "
        regExString += optionName == _optionName ? "(\\S*)" : motorOptions[_optionName]
    })

    regExString = regExString.replace(".", "\\.");
    regExString = regExString.replace(/  /g, " ");
    console.log(regExString)
    let regex = new RegExp(regExString);
    let enabledArray = []

    motorManager.motorArray.forEach((motor) => {
        const regExpExecArray = regex.exec(motor.name)
        if (!regExpExecArray) return
        const id = motorManager.optionObject[optionName].indexOf(regExpExecArray[1])
        enabledArray[id] = true
    })


    glbFiles.forEach((fileName) => {
        const regExpExecArray = regex.exec(fileName)
        if (!regExpExecArray) return
        const id = motorManager.optionObject[optionName].indexOf(regExpExecArray[1])
        enabledArray[id] = true
    })

    for (const option of select.children)
    {
        option.className = enabledArray[option.id] ? "enabled" : "disabled"
    }
}
