import GLTFViewer from './GLTFViewer.js'

const list = document.getElementById("list");
GLTFViewer.start()
GLTFViewer.loadGltf(list.value)
list.addEventListener('change', (e) => {
    GLTFViewer.loadGltf(list.value)
})


// const motorList = document.getElementById("motor-list");
// const frontshieldList = document.getElementById("frontshield-list");
// const coolingList = document.getElementById("cooling-list");
// const optionList = document.getElementById("option-list");
// const kkList = document.getElementById("kk-list");
// const motorString = document.getElementById("motor-string")

// let motor = ""
// let frontshield = ""
// let cooling = ""
// let option = ""
// let kk = ""

// motorList.addEventListener('change', callback);
// frontshieldList.addEventListener('change', callback);
// coolingList.addEventListener('change', callback);
// optionList.addEventListener('change', callback);
// kkList.addEventListener('change', callback);

// function callback(e) {
//     motor = motorList.value
//     frontshield = frontshieldList.value
//     cooling = coolingList.value
//     option = optionList.value
//     kk = kkList.value

//     let str = `${motor} ${frontshield} ${cooling} ${option} ${kk}`
//     console.log(str)
//     motorString.innerHTML = str;
// }


