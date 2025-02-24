import DataUriParser from "datauri/parser.js";
import path from 'path';

const parser = new DataUriParser();

const getDataUri = (file)=>{
    const extName = path.extname(file.originalname).toString();  //ensrue this>>file.originalname<< is correct
    return parser.format(extName,file.buffer).content;
};
 export default  getDataUri;


