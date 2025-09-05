declare class Observer {
    _moveAlong?: (path: any, options: any) => void;
    _pauseMove?: () => void;
    _stopMove?: () => void;
    message: any;
    constructor();
    /**
     * `$on` 向消息队列添加内容
     * @param {*} type 事件名 (事件类型)
     * @param {*} callback 回调函数
     */
    on(type: any, callback: any): void;
    /**
     * off 删除消息队列里的内容
     * @param {*} type 事件名 (事件类型)
     * @param {*} callback 回调函数
     */
    off(type: any, callback: any): void;
    /**
     * emit 触发消息队列里的内容
     * @param {*} type 事件名 (事件类型)
     */
    emit(type: any, ...arg: any[]): void;
}
declare const createAnimation: (marker: any, animation: any, getDistance: any, changePosition: (position: [number, number]) => void) => Observer;
export { createAnimation, Observer };
