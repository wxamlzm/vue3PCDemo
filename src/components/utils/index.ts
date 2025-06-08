export async function createDownloadUrl(filePath: string, fileName: string) {
  try {
    const res = await fetch(filePath);
    const blob = await res.blob();
    const link = document.createElement("a");

    const url = window.URL.createObjectURL(blob);
    link.href = url;

    link.download = fileName;

    document.body.appendChild(link);

    link.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);
  } catch (err) {
    console.error(err);
  }
}
