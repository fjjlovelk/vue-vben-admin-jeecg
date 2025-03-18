export enum ViewTypeEnum {
  ADD = 'ADD',
  ADD_SUB = 'ADD_SUB',
  EDIT = 'EDIT',
  VIEW = 'VIEW',
}

export function getViewType(viewType: ViewTypeEnum) {
  switch (viewType) {
    case ViewTypeEnum.ADD: {
      return '新增';
    }
    case ViewTypeEnum.ADD_SUB: {
      return '新增下级';
    }
    case ViewTypeEnum.EDIT: {
      return '编辑';
    }
    case ViewTypeEnum.VIEW: {
      return '查看';
    }
    default: {
      return '';
    }
  }
}

export enum RequestEnum {
  DELETE = 'DELETE',
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
}
