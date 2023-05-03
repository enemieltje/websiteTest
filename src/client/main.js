import GLTFViewer from './GLTFViewer.js'

const optionSelectDiv = document.createElement("div");
document.body.appendChild(optionSelectDiv);

GLTFViewer.start()
// GLTFViewer.loadGltf(list.value)

function httpGetAsync(url, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", url, true); // true for asynchronous
    xmlHttp.send(null);
}

httpGetAsync("/getGLB", (responseText) => {
    console.log(responseText)

    const glbFiles = JSON.parse(responseText)
    glbFiles.forEach(optionSet => {
        const select = document.createElement("select");
        select.addEventListener('change', optionCallback)

        optionSet.forEach((optionText) => {
            const option = document.createElement("option");
            option.text = optionText;
            select.add(option)
        })

        optionSelectDiv.append(select)
    });
})

function optionCallback(e) {
    let fileName = ""

    for (const select of optionSelectDiv.children)
    {
        fileName += select.value
        fileName += " "
    }
    GLTFViewer.loadGltf(fileName)

}
