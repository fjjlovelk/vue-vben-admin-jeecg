export enum ViewType {
  Add = 'Add',
  Edit = 'Edit',
  View = 'View',
}

export function getViewType(viewType: ViewType) {
  switch (viewType) {
    case ViewType.Add: {
      return '新增';
    }
    case ViewType.Edit: {
      return '编辑';
    }
    case ViewType.View: {
      return '查看';
    }
    default: {
      return '';
    }
  }
}
