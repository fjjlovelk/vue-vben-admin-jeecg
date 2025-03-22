// 文件大小单位
export const fileUnitArray = [
  'Bytes',
  'KB',
  'MB',
  'GB',
  'TB',
  'PB',
  'EB',
  'ZB',
  'YB',
];

// 计算文件大小
export function calculateFileSize(fileSize: number, unit = fileUnitArray) {
  let size = fileSize;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < unit.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  // 保留两位小数，四舍五入
  size = Math.round(size * 100) / 100;
  return size + (unit?.[unitIndex] ?? '');
}

// 根据url获取文件名
export function getFileNameByUrl(url: string) {
  if (url.includes('\\')) {
    const reg = /\\/g;
    url = url.replaceAll(reg, '/');
  }
  return url.slice(Math.max(0, url.lastIndexOf('/') + 1));
}
