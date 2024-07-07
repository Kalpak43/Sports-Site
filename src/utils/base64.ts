export const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (e?.target?.result) {
        const resString = e.target.result
          .toString()
          .replace(/^data:image\/[^;]+;base64,/, "");
        resolve(resString);
      } else {
        reject(new Error("Failed to load file"));
      }
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsDataURL(file);
  });
};
