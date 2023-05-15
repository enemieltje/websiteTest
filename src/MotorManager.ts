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
            if (!/FP\S+ \S+-\d [B3 ]*B\S* [KK\d ]*TE\S+ Assembly\.glb/g.test(fileName)) {
                console.warn(`Motor rejected! ${fileName}`)
                return
            }
            const motor = new Motor(fileName)

            this.motorArray.push(motor)
        });
        this.fillOptionsArray()
    }

    getMotor(name: string) {
        console.log(name)
        let returnMotor: Motor
        this.motorArray.forEach((motor) => {
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
        kk: /KK\d/,
        cooling: /TE\S+/,
        file: /Assembly\.glb/,
    }

    options: Record<string, string> = {
        type: "",
        size: "",
        feet: "",
        flens: "",
        kk: "",
        cooling: "",
        file: "",
    };

    name: string;
    fileName: string;

    constructor(_fileName: string) {
        this.fileName = "/" + _fileName
        this.name = _fileName.replace(/  /g, " ")
        const filenameSegments = this.name.split(" ")

        filenameSegments.forEach((segment) => {

            const optionName = Motor.getOptionName(segment)
            this.options[optionName] = segment;
        });
    }

    toArray() {
        return Object.values(this.options)
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

