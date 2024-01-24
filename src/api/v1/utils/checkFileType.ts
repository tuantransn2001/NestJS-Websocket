export const checkFileType = (file?: File) => {
  if (!file) return false;

  if (file?.name) {
    const ALLOW_FILE_TYPE = ['gif', 'png', 'jpg'];
    const fileType = file.name.split('.').pop();
    if (ALLOW_FILE_TYPE.includes(fileType)) return true;
  }
  return false;
};
