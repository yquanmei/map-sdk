class Observer {
  _moveAlong?: (path: any, options: any) => void;
  _pauseMove?: () => void;
  _stopMove?: () => void;
  message: {
    [key: string]: ((...args: any[]) => void)[];
  };
  constructor() {
    this.message = {}; // 消息队列
  }

  /**
   * `$on` 向消息队列添加内容
   * @param {*} type 事件名 (事件类型)
   * @param {*} callback 回调函数
   */
  on(type: string, callback: (...args: any[]) => void) {
    // 判断有没有这个属性（事件类型）
    if (!this.message[type]) {
      // 如果没有这个属性，就初始化一个空的数组
      this.message[type] = [];
    }
    // 如果有这个属性，就往他的后面push一个新的callback
    this.message[type].push(callback);
  }

  /**
   * off 删除消息队列里的内容
   * @param {*} type 事件名 (事件类型)
   * @param {*} callback 回调函数
   */
  off(type: string, callback: (...args: any[]) => void) {
    // 判断是否有订阅，即消息队列里是否有type这个类型的事件，没有的话就直接return
    if (!this.message[type]) return;
    // 判断是否有callback这个参数
    if (!callback) {
      // 如果没有callback,就删掉整个事件
      this.message[type] = undefined as any;
      return;
    }
    // 如果有callback,就仅仅删掉callback这个消息(过滤掉这个消息方法)
    this.message[type] = this.message[type].filter((item) => item !== callback);
  }

  /**
   * emit 触发消息队列里的内容
   * @param {*} type 事件名 (事件类型)
   */
  emit(type: string, ...arg: any[]) {
    // 判断是否有订阅
    if (!this.message[type]) return;
    // 如果有订阅，就对这个`type`事件做一个轮询 (for循环)
    this.message[type].forEach((item) => {
      // 挨个执行每一个消息的回调函数callback
      item(...arg);
    });
  }
}

const createAnimation = (marker: any, animation: any, getDistance: any, changePosition: (position: [number, number]) => void) => {
  // 自定义动画
  let timeout = false;
  let timeoutTimer: any;
  let animationObserver = new Observer();
  animationObserver._moveAlong = (path: any, options: any) => {
    const duration = options.duration;
    let movingPoint: any;
    // let movingIndex
    const timer = 10;
    const movingPath = path;
    let currentIndex = 0;
    // movingIndex = currentPoint.routeIndex
    //计时器开始
    const timeStart = () => {
      movingPoint = movingPath[currentIndex];
      timeout = false;
      const time = () => {
        if (timeout) return;
        if (currentIndex + 1 >= movingPath.length) {
          //从头开始
          // currentPoint.routeIndex = 0;
          //移除要素
          animation.emit("movealong");
          currentIndex = 0;
          clearIntervalTime();
          //重复运动
          return;
        }
        // 到达下一个点了 需要变化
        const nextPosition = nextPoint();
        const passedPath = movingPath.slice(0, currentIndex + 1).concat([movingPoint]);
        const passedPathWithR = movingPath.slice(0, currentIndex + 1).concat({ lng: movingPoint[0], lat: movingPoint[1] });
        // if (marker && marker.label && animationOptions.marker.label.content) {
        //   marker.label.setPosition(movingPoint);
        // }
        animation.emit("moving", {
          index: currentIndex,
          passedPath,
          passedPathWithR,
          target: {
            getPosition: () => {
              return movingPoint;
            },
          },
        });
        if (nextPosition === movingPath[currentIndex + 1]) {
          currentIndex++;
          animation.emit("moveend", "这是测试");
        }
        //改变坐标点
        changePosition(nextPosition);
        timeoutTimer = setTimeout(time, timer);
      };
      time();
    };

    //计算下一个点的位置
    //这里的算法是计算了两点之间的点   两点之间的连线可能存在很多个计算出来的点
    const nextPoint = () => {
      let routeIndex = currentIndex;
      let p1 = movingPoint; //获取在屏幕的像素位置
      let p2 = movingPath[routeIndex + 1];
      let dx = p2[0] - p1[0];
      let dy = p2[1] - p1[1];
      //在没有走到下一个点之前，下一个点是不变的，前一个点以这个点为终点向其靠近
      // 步长
      const distanceBetween = getDistance(movingPath[routeIndex], movingPath[routeIndex + 1]);
      const dis = getDistance(p1, p2);
      const step = (distanceBetween / duration) * timer;
      const count = Math.round(dis / step);
      if (step === 0 || count < 1) {
        movingPoint = movingPath[routeIndex + 1];
        return movingPath[routeIndex + 1];
      } else {
        let x = p1[0] + dx / count;
        let y = p1[1] + dy / count;
        let coor = [x, y];
        movingPoint = coor; //这里会将前一个点重新赋值  要素利用这个坐标变化进行移动
        return coor;
      }
    };
    timeStart();
  };
  const clearIntervalTime = () => {
    if (timeoutTimer) clearTimeout(timeoutTimer);
    timeout = true;
  };
  animationObserver._pauseMove = () => {
    clearIntervalTime();
  };
  animationObserver._stopMove = () => {
    clearIntervalTime();
  };
  return animationObserver;
};

export { createAnimation, Observer };
