import { MapSDK, MapProvider, MarkerClusterPoint, MarkerClusterOptions } from '../src/index';

/**
 * 标记点聚合示例 - TypeScript版本
 */
async function markerClusterExample() {
  try {
    // 创建地图SDK实例
    const map = new MapSDK(MapProvider.AMAP);

    // 初始化地图
    await map.init({
      container: 'map-container',
      center: [116.397428, 39.90923], // 北京天安门
      zoom: 12,
      apiKey: 'your-amap-api-key' // 请替换为你的API密钥
    });

    console.log('地图初始化成功');

    // 定义坐标点数据
    const points: MarkerClusterPoint[] = [
      { position: [116.397428, 39.90923], title: '天安门广场' },
      { position: [116.407428, 39.91923], title: '故宫博物院' },
      { position: [116.417428, 39.92923], title: '景山公园' },
      { position: [116.427428, 39.93923], title: '北海公园' },
      { position: [116.437428, 39.94923], title: '什刹海' },
      { position: [116.447428, 39.95923], title: '南锣鼓巷' },
      { position: [116.457428, 39.96923], title: '雍和宫' },
      { position: [116.467428, 39.97923], title: '地坛公园' },
      { position: [116.477428, 39.98923], title: '奥林匹克公园' },
      { position: [116.487428, 39.99923], title: '鸟巢' }
    ];

    // 定义聚合选项
    const clusterOptions: MarkerClusterOptions = {
      gridSize: 60, // 聚合距离60像素
      maxZoom: 18, // 最大聚合层级18
      renderClusterMarker: `
        <div style="
          background-color: #ff6b6b; 
          color: white; 
          border-radius: 50%; 
          width: 40px; 
          height: 40px; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          font-weight: bold;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        ">
          {count}
        </div>
      `,
      renderMarker: {
        position: [0, 0], // 占位符，实际位置从points中获取
        icon: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
        title: '景点'
      }
    };

    // 添加标记点聚合
    const cluster = await map.addMarkerCluster(points, clusterOptions);
    
    console.log('聚合标记点添加成功:', cluster);
    console.log('聚合包含的点数量:', cluster.points.length);

    // 演示添加新点到聚合
    setTimeout(() => {
      const newPoint: MarkerClusterPoint = {
        position: [116.497428, 40.00923],
        title: '颐和园'
      };
      
      cluster.addPoint(newPoint);
      console.log('新点已添加到聚合:', newPoint);
    }, 3000);

    // 演示移除点
    setTimeout(() => {
      const pointToRemove = points[0];
      cluster.removePoint(pointToRemove);
      console.log('点已从聚合中移除:', pointToRemove);
    }, 6000);

    // 演示清空聚合
    setTimeout(() => {
      cluster.clear();
      console.log('聚合已清空');
    }, 9000);

    // 演示移除整个聚合
    setTimeout(() => {
      map.removeMarkerCluster(cluster);
      console.log('聚合已完全移除');
    }, 12000);

  } catch (error) {
    console.error('地图聚合示例执行失败:', error);
  }
}

/**
 * 多聚合示例
 */
async function multipleClustersExample() {
  try {
    const map = new MapSDK(MapProvider.GOOGLE);

    await map.init({
      container: 'map-container',
      center: [116.397428, 39.90923],
      zoom: 10,
      apiKey: 'your-google-maps-api-key'
    });

    // 北京景点聚合
    const beijingPoints: MarkerClusterPoint[] = [
      { position: [116.397428, 39.90923], category: 'beijing' },
      { position: [116.407428, 39.91923], category: 'beijing' },
      { position: [116.417428, 39.92923], category: 'beijing' }
    ];

    const beijingCluster = await map.addMarkerCluster(beijingPoints, {
      gridSize: 50,
      renderClusterMarker: '<div style="background-color: #4CAF50; color: white; border-radius: 50%; width: 35px; height: 35px; display: flex; align-items: center; justify-content: center; font-weight: bold;">{count}</div>'
    });

    // 上海景点聚合
    const shanghaiPoints: MarkerClusterPoint[] = [
      { position: [121.473701, 31.230416], category: 'shanghai' },
      { position: [121.473701, 31.230416], category: 'shanghai' },
      { position: [121.473701, 31.230416], category: 'shanghai' }
    ];

    const shanghaiCluster = await map.addMarkerCluster(shanghaiPoints, {
      gridSize: 70,
      renderClusterMarker: '<div style="background-color: #2196F3; color: white; border-radius: 50%; width: 45px; height: 45px; display: flex; align-items: center; justify-content: center; font-weight: bold;">{count}</div>'
    });

    console.log('多聚合创建成功');
    console.log('北京聚合:', beijingCluster);
    console.log('上海聚合:', shanghaiCluster);

  } catch (error) {
    console.error('多聚合示例执行失败:', error);
  }
}

/**
 * 动态聚合示例
 */
async function dynamicClusterExample() {
  try {
    const map = new MapSDK(MapProvider.OPENLAYERS);

    await map.init({
      container: 'map-container',
      center: [116.397428, 39.90923],
      zoom: 11
    });

    // 创建空聚合
    const cluster = await map.addMarkerCluster([], {
      gridSize: 80,
      maxZoom: 16,
      renderClusterMarker: '<div style="background-color: #FF9800; color: white; border-radius: 50%; width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; font-weight: bold;">{count}</div>'
    });

    // 动态添加点
    const dynamicPoints = [
      { position: [116.397428, 39.90923] },
      { position: [116.407428, 39.91923] },
      { position: [116.417428, 39.92923] },
      { position: [116.427428, 39.93923] },
      { position: [116.437428, 39.94923] }
    ];

    // 每隔1秒添加一个点
    dynamicPoints.forEach((point, index) => {
      setTimeout(() => {
        cluster.addPoint(point);
        console.log(`添加第${index + 1}个点:`, point);
      }, (index + 1) * 1000);
    });

  } catch (error) {
    console.error('动态聚合示例执行失败:', error);
  }
}

// 导出示例函数
export {
  markerClusterExample,
  multipleClustersExample,
  dynamicClusterExample
};

// 如果直接运行此文件
if (typeof window !== 'undefined') {
  // 在浏览器环境中运行示例
  window.addEventListener('load', () => {
    console.log('开始运行标记点聚合示例...');
    markerClusterExample();
  });
} 