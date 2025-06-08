import { nextTick, h } from "vue";
import { type TableColumnType, type TableColumnsType } from "ant-design-vue";

// 封装事件绑定函数
const handleMouseEnter = async (event: MouseEvent) => {
  // 获取当前单元格元素
  const cell = (event.currentTarget as HTMLElement).closest(
    "td"
  ) as HTMLElement;

  if (!cell) return;
  // 获取内容元素（带有cell-content类的元素）
  const textEl = cell.querySelector(".cell-content") as HTMLElement;

  // 等下一次DOM更新循环，确保内容已渲染
  await nextTick();
  // 判断内容是否溢出；如果内容的实际宽度大于可见度
  if (textEl && textEl.scrollWidth > textEl.clientWidth) {
    // 如果溢出，设置title属性（会触发原生tooltip）
    cell.setAttribute("title", textEl.innerText);
  } else {
    // 如果没有溢出，移除title属性，即不显示tooltip
    cell.removeAttribute("title");
  }
};

export function useEllipsisTooltip() {
  const createEllipsisColumn = (column: TableColumnType) => {
    // 保留原始的customRender
    const originalRender = column.customRender;
    const originalTitle = column.title;
    return {
      ...column,
      title:
        typeof originalTitle === "string"
          ? () => h("span", { title: "" }, originalTitle)
          : originalTitle,

      ellipsis: { showTitle: false },

      customCell: () => ({ class: "ellipsis-cell" }), // 添加类名用于样式控制

      customRender: originalRender
        ? (record) => {
            const renderedContent = originalRender(record);
            return h(
              "span",
              {
                class: "cell-content",
                onMouseenter: handleMouseEnter,
              },
              renderedContent
            );
          }
        : ({ text }) =>
            h(
              "span",
              {
                class: "cell-content",
                onMouseenter: handleMouseEnter,
              },
              text
            ),
    };
  };

  const createEllipsisColumns = (columns) => {
    return columns.map((column) => createEllipsisColumn(column));
  };

  return {
    createEllipsisColumn,
    createEllipsisColumns,
  };
}
