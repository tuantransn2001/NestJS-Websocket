export class FileHandler {
  public static checkFileType(file?: File) {
    if (!file || !file?.name) return false;

    const ALLOW_FILE_TYPE = ['gif', 'png', 'jpg'];
    const fileType = file.name.split('.').pop();
    if (ALLOW_FILE_TYPE.includes(fileType)) return true;
  }
}
