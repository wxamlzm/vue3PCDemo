import type { TableColumnType } from "ant-design-vue";
import { Button, Space, Divider } from "ant-design-vue";
import { VNode } from "vue";

interface TableItem {
  id: number;
  name: string;
  status: 0 | 1;
  [key: string]: any;
}

interface ActionButton {
  text: string;
  type?: "link" | "primary" | "default";
  danger?: boolean;
  confirmText?: string;
  visible?: (record: TableItem) => boolean;
  onClick: (record: TableItem) => void;
}

interface CustomAction {
  // 用于标识这是自定义组件而非按钮
  isCustom: true;
  // 渲染自定义组件的函数
  render: (record: TableItem) => VNode;
  // 可见性控制函数
  visible?: (record: TableItem) => boolean;
}

// 定义一个联合类型，允许操作可以是按钮或自定义组件
type Action = ActionButton | CustomAction;

export const useTableAction = (actions: Action[]) => {
  // 判断action是否为自定义组件
  const isCustomAction = (action: Action): action is CustomAction => {
    return (action as CustomAction).isCustom === true;
  };

  // 渲染按钮
  const renderActionButton = (button: ActionButton, record: TableItem) => {
    if (button.visible && !button.visible(record)) return null;

    const buttonContent = (
      <Button
        type={button.type || "link"}
        onClick={() => button.onClick(record)}
        danger={button.danger}
      >
        {button.text}
      </Button>
    );

    return buttonContent;
  };

  // 渲染操作（按钮或自定义组件）
  const renderAction = (action: Action, record: TableItem) => {
    // 检查可见性
    if ('visible' in action && action.visible && !action.visible(record)) return null;

    // 如果是自定义组件，调用其render函数
    if (isCustomAction(action)) {
      return action.render(record);
    } else {
      // 否则按照按钮处理
      return renderActionButton(action, record);
    }
  };

  const actionColumn: TableColumnType = {
    title: '操作',
    key: 'action',
    fixed: 'right',
    align: 'center',
    width: 120,
    customRender: ({ record }) => {
      return (
        <Space>
          {actions.map((action, index) => (
            <span key={index}>
              {renderAction(action, record)}
              {index < actions.length - 1 && <Divider type="vertical" />}
            </span>
          ))}
        </Space>
      );
    }
  };

  return {
    actionColumn
  };
};