import GLTFViewer from './GLTFViewer.js'

const list = document.getElementById("list");
GLTFViewer.start()
GLTFViewer.loadGltf(list.value)
list.addEventListener('change', (e) => {
    GLTFViewer.loadGltf(list.value)
})

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
    const glbFiles = JSON.parse(responseText)
    glbFiles.forEach(fileName => {
        const option = document.createElement("option");
        option.text = fileName;
        list.add(option)
    });
    console.log(`received GET response:`)
    console.log(responseText)
})
