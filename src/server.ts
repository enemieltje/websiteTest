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
    private glbFileMap: Map<string, string> = new Map()
    decoder = new TextDecoder();

    constructor() {
    }


    async start(port = 8080) {
        this.server = express();
        this.readGlbFiles();

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
            res.send(this.glbFiles)
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
            fileName = fileName.replace(/%20/g, " ")
            console.log(fileName)
            if (this.glbFileMap.has(fileName)) fileName = this.glbFileMap.get(fileName)!

            fileName = "GLB/" + fileName

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
            let shortFileName = fileName.replace(/  /g, " ")
            this.glbFiles[i] = shortFileName;
            this.glbFileMap.set("/" + shortFileName, fileName);
            console.log(`${shortFileName}: ${fileName}`)
        });
    }

}
