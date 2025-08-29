/**
 * DOM操作相关的工具函数
 */
export declare class DOMError extends Error {
    constructor(message: string);
}
/**
 * 将输入内容转换为DOM元素
 * @param input 输入内容（DOM元素、HTML字符串或其他类型）
 * @returns HTMLElement 转换后的DOM元素
 */
export declare function createDomContent(input: unknown): HTMLElement;
/**
 * 安全地设置元素的innerHTML
 * @param element 目标元素
 * @param content HTML内容
 */
export declare function safeSetInnerHTML(element: HTMLElement, content: string): void;
/**
 * 安全地克隆DOM元素
 * @param element 要克隆的元素
 * @param deep 是否深度克隆
 * @returns 克隆的元素
 */
export declare function safeCloneElement(element: HTMLElement, deep?: boolean): HTMLElement;
