/**
 * DOM操作相关的工具函数
 */

// 错误类定义
export class DOMError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DOMError";
  }
}

/**
 * 将HTML字符串转换为DOM节点（现代浏览器首选）
 * @param htmlString HTML字符串
 * @returns 解析后的DOM节点
 */
function safeStringToDOM(htmlString: string): Node | null {
  try {
    const template = document.createElement("template");
    template.innerHTML = htmlString.trim();
    return template.content.firstChild;
  } catch (error) {
    throw new DOMError(`Failed to parse HTML string: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

/**
 * 将HTML字符串转换为DOM节点（兼容旧浏览器）
 * @param htmlString HTML字符串
 * @returns 解析后的DOM节点
 */
function legacyStringToDOM(htmlString: string): Node | null {
  try {
    const div = document.createElement("div");
    div.innerHTML = htmlString;
    return div.firstChild;
  } catch (error) {
    throw new DOMError(`Failed to parse HTML string with legacy method: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

/**
 * 创建DOM节点内容
 * @param htmlString HTML字符串
 * @returns 解析后的DOM节点
 */
function createDomContentFromString(htmlString: string): HTMLElement {
  if (!htmlString || typeof htmlString !== "string") {
    throw new DOMError("HTML string is required and must be a non-empty string");
  }

  // 检测浏览器是否支持template元素的content特性
  const isTemplateSupported = "content" in document.createElement("template");

  const domNode = isTemplateSupported ? safeStringToDOM(htmlString) : legacyStringToDOM(htmlString);

  if (!(domNode instanceof HTMLElement)) {
    throw new DOMError("无法从字符串创建有效的DOM元素");
  }

  return domNode;
}

/**
 * 检查是否在浏览器环境中
 */
function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

/**
 * 验证输入是否为有效的HTMLElement
 */
function isValidHTMLElement(input: unknown): input is HTMLElement {
  return isBrowser() && input instanceof HTMLElement;
}

/**
 * 将输入内容转换为DOM元素
 * @param input 输入内容（DOM元素、HTML字符串或其他类型）
 * @returns HTMLElement 转换后的DOM元素
 */
export function createDomContent(input: unknown): HTMLElement {
  // 1. 如果已经是DOM元素，直接返回
  if (isValidHTMLElement(input)) {
    return input;
  }

  // 2. 如果是字符串，调用createDomContentFromString转换
  if (typeof input === "string") {
    try {
      return createDomContentFromString(input);
    } catch (error) {
      console.warn("字符串转换为DOM失败，使用默认空div", error);
    }
  }

  // 3. 其他情况返回空div
  if (!isBrowser()) {
    throw new DOMError("DOM operations are not available in this environment");
  }

  const emptyDiv = document.createElement("div");
  emptyDiv.className = "empty";
  emptyDiv.setAttribute("data-fallback", "true");
  return emptyDiv;
}

// /**
//  * 安全地设置元素的innerHTML
//  * @param element 目标元素
//  * @param content HTML内容
//  */
// export function safeSetInnerHTML(element: HTMLElement, content: string): void {
//   if (!isValidHTMLElement(element)) {
//     throw new DOMError("Invalid HTMLElement provided");
//   }

//   if (typeof content !== "string") {
//     throw new DOMError("Content must be a string");
//   }

//   try {
//     element.innerHTML = content;
//   } catch (error) {
//     throw new DOMError(`Failed to set innerHTML: ${error instanceof Error ? error.message : "Unknown error"}`);
//   }
// }

// /**
//  * 安全地克隆DOM元素
//  * @param element 要克隆的元素
//  * @param deep 是否深度克隆
//  * @returns 克隆的元素
//  */
// export function safeCloneElement(element: HTMLElement, deep = true): HTMLElement {
//   if (!isValidHTMLElement(element)) {
//     throw new DOMError("Invalid HTMLElement provided for cloning");
//   }

//   try {
//     const cloned = element.cloneNode(deep) as HTMLElement;
//     return cloned;
//   } catch (error) {
//     throw new DOMError(`Failed to clone element: ${error instanceof Error ? error.message : "Unknown error"}`);
//   }
// }
