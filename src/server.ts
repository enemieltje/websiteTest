import express, { Express, Request, Response } from 'express'
import { SendFileOptions } from 'express-serve-static-core';
import fs from 'fs'


export default class HttpServer {
    private server?: Express;
    private path = "./src/client";
    private glbPath = "./public/GLB"
    private htmlFile = fs.readFileSync(`${this.path}/index.html`, { encoding: "utf-8" })
    private jsFile = fs.readFileSync(`${this.path}/main.js`, { encoding: "utf-8" })
    private gltfViewerFile = fs.readFileSync(`${this.path}/GLTFViewer.js`, { encoding: "utf-8" })
    private glbFiles: string[] = [];
    private optionArray: string[][] = [];
    decoder = new TextDecoder();

    constructor() {
    }


    async start(port = 8080) {
        this.server = express();
        this.readGlbFiles();
        this.getMotorOptions()

        this.server.get('/', (req: Request, res) => {
            res.send(this.htmlFile)
        })
        this.server.get('/main.js', (req: Request, res) => {
            res.type('js')
            res.send(fs.readFileSync(`${this.path}/main.js`, { encoding: "utf-8" }))
        })
        this.server.get('/GLTFViewer.js', (req: Request, res) => {
            res.type('js')
            res.send(fs.readFileSync(`${this.path}/GLTFViewer.js`, { encoding: "utf-8" }))
        })
        this.server.get('/getGLB', (req: Request, res) => {

            res.send(this.optionArray)
        })

        this.server.get(/\/\S+\.glb/, (req, res, next) => {
            let options = {
                root: `${__dirname}/../public/`,
                dotfiles: 'deny',
                headers: {
                    'x-timestamp': Date.now(),
                    'x-sent': true
                }
            }

            // replace %20 with spaces
            let fileName = `${req.url.split(".")[0]}.glb`
            fileName = "GLB/" + fileName.replace(/%20/g, " ")

            console.log(fileName)

            if (!fs.existsSync(`./public/${fileName}`)) {
                fileName = '/Bee.glb'
            }

            res.sendFile(fileName, options as SendFileOptions, function (err) {
                if (err) {
                    next(err)
                } else {
                    console.log('Sent:', fileName)
                }
            })
        })
        this.server.get('*', (req: Request, res) => {
            console.log(`uncaught request: ${req.url}`)
        })
        this.server.listen(port, () => {
            console.log(`Server is listening on port ${port}`)
        })

    }

    readGlbFiles() {
        this.glbFiles = fs.readdirSync(this.glbPath);
        this.glbFiles.forEach((fileName, i) => {
            fileName = fileName.replace(/  /g, " ")
            this.glbFiles[i] = fileName;
        });
    }

    getMotorOptions() {
        const optionSetArray: Set<string>[] = []
        this.glbFiles.forEach((fileName) => {
            const optionArray = fileName.split(" ")
            optionArray.forEach((option, i) => {
                optionSetArray[i] ? optionSetArray[i].add(option) : optionSetArray[i] = new Set([option])
            })
        })
        optionSetArray.forEach((set, i) => {
            set.forEach((v) => {
                this.optionArray[i] ? this.optionArray[i].push(v) : this.optionArray[i] = [v]
            })
        })
        console.log(this.optionArray)
    }

}
