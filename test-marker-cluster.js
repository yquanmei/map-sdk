// 测试标记点聚合功能
import { MapSDK, MapProvider } from './src/index.js';

async function testMarkerCluster() {
  console.log('开始测试标记点聚合功能...');

  try {
    // 创建地图SDK实例
    const map = new MapSDK(MapProvider.AMAP);
    console.log('✓ MapSDK 实例创建成功');

    // 初始化地图
    await map.init({
      container: 'map',
      center: [116.397428, 39.90923],
      zoom: 12
    });
    console.log('✓ 地图初始化成功');

    // 定义测试坐标点
    const testPoints = [
      { position: [116.397428, 39.90923], title: '天安门广场' },
      { position: [116.407428, 39.91923], title: '故宫博物院' },
      { position: [116.417428, 39.92923], title: '景山公园' },
      { position: [116.427428, 39.93923], title: '北海公园' },
      { position: [116.437428, 39.94923], title: '什刹海' }
    ];

    // 添加标记点聚合
    const cluster = await map.addMarkerCluster(testPoints, {
      gridSize: 60,
      maxZoom: 18,
      renderClusterMarker: '<div style="background-color: #ff6b6b; color: white; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; font-weight: bold;">{count}</div>'
    });

    console.log('✓ 标记点聚合添加成功');
    console.log('  聚合ID:', cluster.id);
    console.log('  聚合点数量:', cluster.points.length);

    // 测试添加新点
    const newPoint = { position: [116.447428, 39.95923], title: '南锣鼓巷' };
    cluster.addPoint(newPoint);
    console.log('✓ 新点添加成功，当前点数量:', cluster.points.length);

    // 测试移除点
    cluster.removePoint(testPoints[0]);
    console.log('✓ 点移除成功，当前点数量:', cluster.points.length);

    // 测试清空聚合
    cluster.clear();
    console.log('✓ 聚合清空成功，当前点数量:', cluster.points.length);

    // 测试移除聚合
    map.removeMarkerCluster(cluster);
    console.log('✓ 聚合移除成功');

    console.log('\n🎉 所有测试通过！标记点聚合功能正常工作。');

  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    console.error('错误详情:', error);
  }
}

// 如果直接运行此文件
if (typeof window !== 'undefined') {
  // 在浏览器环境中运行
  window.addEventListener('load', testMarkerCluster);
} else {
  // 在 Node.js 环境中运行
  console.log('请在浏览器环境中运行此测试');
}

export { testMarkerCluster }; 