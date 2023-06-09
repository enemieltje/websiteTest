import express, { Express, Request, Response } from 'express'
import { SendFileOptions } from 'express-serve-static-core';
import fs from 'fs'
import { MotorManager } from './MotorManager';


export default class HttpServer {
    private server?: Express;
    private path = "./src/client";
    private glbPath = "./public/GLB"
    private htmlFile = fs.readFileSync(`${this.path}/index.html`, { encoding: "utf-8" })
    private motorManager = new MotorManager(this.glbPath);
    decoder = new TextDecoder();

    constructor() {
    }

    async start(port = 8080) {
        this.server = express();

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
        this.server.get('/getMotorManager', (req: Request, res) => {
            res.send(this.motorManager)
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
            let motorName = `${req.url.split(".")[0]}.glb`
            motorName = motorName.replace(/%20/g, " ")

            const motor = this.motorManager.getMotor(motorName)
            let fileName = motor ? "GLB/" + motor.fileName : '/Bee.glb'

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
}
