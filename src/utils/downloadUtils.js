import JSZip from "jszip";

export const downloadWorkspaceAsZip = async (
  files,
  workspaceTitle = "Crafta-Workspace"
) => {
  try {
    const zip = new JSZip();

    Object.entries(files).forEach(([filePath, fileData]) => {
      if (fileData && fileData.code) {
        const cleanPath = filePath.startsWith("/")
          ? filePath.slice(1)
          : filePath;
        zip.file(cleanPath, fileData.code);
      }
    });

    const zipBlob = await zip.generateAsync({ type: "blob" });

    const url = URL.createObjectURL(zipBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${workspaceTitle.replace(/[^a-z0-9]/gi, "-").toLowerCase()}.zip`;

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error("Error creating zip file:", error);
    return false;
  }
};
