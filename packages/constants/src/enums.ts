export enum ViewTypeEnum {
  Add = 'Add',
  Edit = 'Edit',
  View = 'View',
}

export function getViewType(viewType: ViewTypeEnum) {
  switch (viewType) {
    case ViewTypeEnum.Add: {
      return '新增';
    }
    case ViewTypeEnum.Edit: {
      return '编辑';
    }
    case ViewTypeEnum.View: {
      return '查看';
    }
    default: {
      return '';
    }
  }
}
