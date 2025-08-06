/**
 * 将HTML字符串转换为DOM节点（现代浏览器首选）
 * @param htmlString HTML字符串
 * @returns 解析后的DOM节点
 */
function safeStringToDOM(htmlString: string): Node | null {
  const template = document.createElement("template");
  template.innerHTML = htmlString.trim();
  return template.content.firstChild;
}

/**
 * 将HTML字符串转换为DOM节点（兼容旧浏览器）
 * @param htmlString HTML字符串
 * @returns 解析后的DOM节点
 */
function legacyStringToDOM(htmlString: string): Node | null {
  const div = document.createElement("div");
  div.innerHTML = htmlString;
  return div.firstChild;
}

/**
 * 创建DOM节点内容
 * @param htmlString HTML字符串
 * @returns 解析后的DOM节点
 */
export const createDivContent = (htmlString: string): Node | null => {
  // 检测浏览器是否支持template元素的content特性
  const isTemplateSupported = "content" in document.createElement("template");

  const domNode = isTemplateSupported ? safeStringToDOM(htmlString) : legacyStringToDOM(htmlString);

  return domNode;
};
