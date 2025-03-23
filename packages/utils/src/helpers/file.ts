// 文件大小单位
import { openWindow } from '@vben-core/shared/utils';

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

export function checkFileType(file: File, accepts: string[]) {
  const newTypes = accepts.join('|');
  // const reg = /\.(jpg|jpeg|png|gif|txt|doc|docx|xls|xlsx|xml)$/i;
  const reg = new RegExp(`${String.raw`\.(` + newTypes})$`, 'i');
  return reg.test(file.name);
}

export function checkImgType(file: File) {
  return isImgTypeByName(file.name);
}

export function isImgTypeByName(name: string) {
  return /\.(?:jpg|jpeg|png|gif)$/i.test(name);
}

export function getBase64WithFile(file: File) {
  return new Promise<{
    file: File;
    result: string;
  }>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.addEventListener('load', () =>
      resolve({ result: reader.result as string, file }),
    );
    // eslint-disable-next-line unicorn/prefer-add-event-listener
    reader.onerror = (error) => reject(error);
  });
}

export function downloadByUrl({
  url,
  target = '_blank',
  fileName,
}: {
  fileName?: string;
  target?: '_blank' | '_self';
  url: string;
}): boolean {
  const isChrome = window.navigator.userAgent.toLowerCase().includes('chrome');
  const isSafari = window.navigator.userAgent.toLowerCase().includes('safari');

  if (/iP/.test(window.navigator.userAgent)) {
    console.error('Your browser does not support download!');
    return false;
  }
  if (isChrome || isSafari) {
    const link = document.createElement('a');
    link.href = url;
    link.target = target;

    if (link.download !== undefined) {
      link.download =
        // eslint-disable-next-line unicorn/prefer-string-slice
        fileName || url.substring(url.lastIndexOf('/') + 1, url.length);
    }
    if (document.createEvent) {
      const e = document.createEvent('MouseEvents');
      e.initEvent('click', true, true);
      link.dispatchEvent(e);
      return true;
    }
  }
  if (!url.includes('?')) {
    url += '?download';
  }
  openWindow(url, { target });
  return true;
}
