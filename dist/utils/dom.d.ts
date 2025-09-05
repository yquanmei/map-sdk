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
