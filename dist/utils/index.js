/**
 * 将HTML字符串转换为DOM节点（现代浏览器首选）
 * @param htmlString HTML字符串
 * @returns 解析后的DOM节点
 */
const safeStringToDOM = (htmlString) => {
    const template = document.createElement("template");
    template.innerHTML = htmlString.trim();
    return template.content.firstChild;
};
/**
 * 将HTML字符串转换为DOM节点（兼容旧浏览器）
 * @param htmlString HTML字符串
 * @returns 解析后的DOM节点
 */
const legacyStringToDOM = (htmlString) => {
    const div = document.createElement("div");
    div.innerHTML = htmlString;
    return div.firstChild;
};
/**
 * 创建DOM节点内容
 * @param htmlString HTML字符串
 * @returns 解析后的DOM节点
 */
const createDomContentFromString = (htmlString) => {
    // 检测浏览器是否支持template元素的content特性
    const isTemplateSupported = "content" in document.createElement("template");
    const domNode = isTemplateSupported ? safeStringToDOM(htmlString) : legacyStringToDOM(htmlString);
    if (!(domNode instanceof HTMLElement)) {
        throw new Error("无法从字符串创建有效的DOM元素");
    }
    return domNode;
};
/**
 * 将输入内容转换为DOM元素
 * @param input 输入内容（DOM元素、HTML字符串或其他类型）
 * @returns HTMLElement 转换后的DOM元素
 */
export const createDomContent = (input) => {
    // 1. 如果已经是DOM元素，直接返回
    if (typeof window !== "undefined" && input instanceof HTMLElement) {
        return input;
    }
    // 2. 如果是字符串，调用createDomContent转换
    if (typeof input === "string") {
        try {
            // 假设createDomContent是一个将字符串转换为DOM的方法
            return createDomContentFromString(input);
        }
        catch (e) {
            console.warn("字符串转换为DOM失败，使用默认空div", e);
        }
    }
    // 3. 其他情况返回空div
    const emptyDiv = document.createElement("div");
    emptyDiv.className = "empty";
    return emptyDiv;
};
