import DataUriparser from 'datauri/parser.js'
import path from 'path'
import { buffer } from 'stream/consumers'


const getdataurl=(file)=>{
    const parser= new DataUriparser()

    const extname =path.extname(file.originalname).toString()
   return parser.format(extname,file.buffer)
}

export default getdataurl