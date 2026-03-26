interface tags {
  color: "alert" | "success" | "disabled" | "primary" | "warning" | null | undefined
  text: string
}

export const resolveStatus = ({ status }: { status: string }) => {
  switch (status) {
    case 'incomplete':
      return { color: 'alert', text: 'Nincs befejezve' } as tags;
    case 'active':
      return { color: 'success', text: 'Előfizetés aktív' } as tags;
    default:
      return { color: 'disabled', text: '' } as tags;
  }
}

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;

  const units = ["KB", "MB", "GB", "TB", "PB"];
  let unitIndex = -1;
  let size = bytes;

  do {
    size /= 1024;
    unitIndex++;
  } while (size >= 1024 && unitIndex < units.length - 1);

  return Number.isInteger(size) ? `${size} ${units[unitIndex]}` : `${size.toFixed(2).replace(/\.00$/, "")} ${units[unitIndex]}`;
}