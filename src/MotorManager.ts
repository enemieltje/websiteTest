import fs from 'fs'

export class MotorManager {
    dirPath: string
    motorArray: Motor[] = []
    optionObject: Record<string, string[]> = {}

    constructor(_dirPath: string) {
        this.dirPath = _dirPath
        this.readGlbFiles();
    }

    private readGlbFiles() {
        const allGlbFiles = fs.readdirSync(this.dirPath);
        allGlbFiles.forEach((fileName) => {
            if (!/FP\S+ \S+-\d [B3 ]*B\S* TE\S+ Assembly\.glb/g.test(fileName)) return
            const motor = new Motor("/" + fileName)

            this.motorArray.push(motor)
        });
        this.fillOptionsArray()
    }

    getMotor(name: string) {
        console.log(name)
        let returnMotor: Motor
        this.motorArray.forEach((motor) => {
            // console.log(`checking ${motor.name} = ${name}`)
            if (motor.name == name) returnMotor = motor
        })
        return returnMotor!
    }

    getGlbFile(name: string) {
        const motor = this.getMotor(name);
        return motor.fileName;
    }

    private fillOptionsArray() {
        const optionSetObject: Record<string, Set<string>> = {}
        this.motorArray.forEach((motor) => {

            Object.keys(motor.options).forEach((optionName) => {
                const option = motor.options[optionName];
                if (!optionSetObject[optionName]) optionSetObject[optionName] = new Set<string>()
                optionSetObject[optionName].add(option)
            })
        });

        this.optionObject = {}
        for (const optionName in optionSetObject) {
            const optionSet = optionSetObject[optionName]
            this.optionObject[optionName] = Array.from(optionSet)
        }
        // optionSetArray.forEach((set, i) => {
        //     set.forEach((v) => {
        //         this.optionArray[i] ? this.optionArray[i].push(v) : this.optionArray[i] = [v]
        //     })
        // })
        console.log(this.optionObject)
    }
    static getMotor() {
        return Motor
    }
    iterateOptions(callback: (optionName: string, i: number) => void) {
        Object.keys(Motor.regex).forEach(callback)
    }
}

export class Motor {
    static regex: Record<string, RegExp> = {
        type: /FP\S+/,
        size: /\S+-\d/,
        feet: /B3/,
        flens: /B[^3 ]+/,
        cooling: /TE\S+/,
        file: /Assembly\.glb/,
    }

    options: Record<string, string> = {
        type: "",
        size: "",
        feet: "",
        flens: "",
        cooling: "",
        file: "",
    };

    name: string;
    fileName: string;

    constructor(_fileName: string) {
        // this.options.type = {
        //     regex: /FP\S+/,
        //     value: ""
        // }
        // this.options.size = {
        //     regex: /\S+-\d/,
        //     value: ""
        // }
        // this.options.feet = {
        //     regex: /B3/,
        //     value: ""
        // }
        // this.options.flens = {
        //     regex: /B[^3 ]*/,
        //     value: ""
        // }
        // this.options.cooling = {
        //     regex: /TE\S+/,
        //     value: ""
        // }
        // this.options.file = {
        //     regex: /Assembly\.glb/,
        //     value: ""
        // }
        this.fileName = _fileName
        this.name = this.fileName.replace(/  /g, " ")
        const filenameSegments = this.name.split(" ")

        filenameSegments.forEach((segment) => {

            const optionName = Motor.getOptionName(segment)
            this.options[optionName] = segment;

            // for (const optionName in this.options) {
            //     const regex = Motor.regex[optionName]
            //     if (regex.test(segment))
            //         this.options[optionName] = segment;
            // }
        });
    }

    toArray() {
        return Object.values(this.options)
        // const arr = []
        // for (const optionName in this.options) {
        //     arr.push(this.options[optionName].value)
        // }
        // return arr
    }

    toString() {
        let str = ""
        for (const optionName in this.options) {
            const value = this.options[optionName]
            if (value) str += value
        }
        return str
    }

    static getOptionName(optionValue: string) {
        let returnOptionName = ""

        for (const optionName in Motor.regex) {
            const regex = Motor.regex[optionName]
            if (regex.test(optionValue))
                returnOptionName = optionName
        }
        return returnOptionName;
    }
}

// interface Option {
//     regex: RegExp,
//     value: string
// }
