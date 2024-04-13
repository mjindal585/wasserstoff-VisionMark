import IVersionableDocument from '../versionable/IVersionableDocument';


export default interface IImageModel extends IVersionableDocument {
    id: string;
    fileName: string;
    originalname: string;
    mimetype: string;
    size: string;
    rawPath: string;
    annotatedPath: string;
    status: string;
    annotations: [any];
}
