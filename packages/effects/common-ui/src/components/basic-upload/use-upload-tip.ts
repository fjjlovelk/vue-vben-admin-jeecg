import type { Ref } from 'vue';

import { computed, unref } from 'vue';

export function useUploadTip({
  acceptRef,
  helpTextRef,
  maxCountRef,
  maxSizeRef,
}: {
  acceptRef: Ref<string[]>;
  helpTextRef: Ref<string | undefined>;
  maxCountRef: Ref<number>;
  maxSizeRef: Ref<number>;
}) {
  // 文件类型限制
  const getAccept = computed(() => {
    const accept = unref(acceptRef);
    if (accept && accept.length > 0) {
      return accept;
    }
    return [];
  });

  const getStringAccept = computed(() => {
    return unref(getAccept)
      .map((item) => {
        return item.indexOf('/') > 0 || item.startsWith('.')
          ? item
          : `.${item}`;
      })
      .join(',');
  });

  // 支持jpg、jpeg、png格式，不超过2M，最多可选择10张图片，。
  const getHelpText = computed(() => {
    const helpText = unref(helpTextRef);
    if (helpText) {
      return helpText;
    }
    const helpTexts: string[] = [];

    const accept = unref(acceptRef);
    if (accept.length > 0) {
      helpTexts.push(`支持${accept.join(',')}格式`);
    }

    const maxSize = unref(maxSizeRef);
    if (maxSize) {
      helpTexts.push(`单个文件不超过${maxSize}MB`);
    }

    const maxCount = unref(maxCountRef);
    if (maxCount && maxCount !== Infinity) {
      helpTexts.push(`最多只能上传${maxCount}个文件`);
    }
    return helpTexts.join('，');
  });

  return { getAccept, getStringAccept, getHelpText };
}
