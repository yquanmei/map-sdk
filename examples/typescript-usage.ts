import { MapSDK, MapProvider, MarkerConfig, IMarker } from '../src/index';

// 示例1: 使用高德地图
async function useAMap() {
  try {
    const map = new MapSDK(MapProvider.AMAP);
    
    await map.init({
      container: 'amap-container',
      center: [116.397428, 39.90923], // 北京天安门
      zoom: 11,
      apiKey: 'your-amap-api-key'
    });

    // 添加标记点
    const marker = await map.addMarker({
      position: [116.397428, 39.90923],
      title: '北京天安门',
      content: '这是天安门广场',
      clickable: true
    });

    // 设置地图中心点
    map.setCenter([116.407428, 39.91923]);
    
    // 设置缩放级别
    map.setZoom(15);

    console.log('高德地图初始化成功');
    return map;
  } catch (error) {
    console.error('高德地图初始化失败:', error);
  }
}

// 示例2: 使用Google Maps
async function useGoogleMaps() {
  try {
    const map = new MapSDK(MapProvider.GOOGLE);
    
    await map.init({
      container: 'google-container',
      center: [116.397428, 39.90923],
      zoom: 11,
      apiKey: 'your-google-maps-api-key'
    });

    // 添加多个标记点
    const markers: MarkerConfig[] = [
      {
        position: [116.397428, 39.90923],
        title: 'Beijing Tiananmen',
        draggable: true
      },
      {
        position: [116.407428, 39.91923],
        title: 'Another Location',
        icon: 'custom-icon.png'
      }
    ];

    for (const markerConfig of markers) {
      await map.addMarker(markerConfig);
    }

    console.log('Google Maps初始化成功');
    return map;
  } catch (error) {
    console.error('Google Maps初始化失败:', error);
  }
}

// 示例3: 使用OpenLayers
async function useOpenLayers() {
  try {
    const map = new MapSDK(MapProvider.OPENLAYERS);
    
    await map.init({
      container: 'openlayers-container',
      center: [116.397428, 39.90923],
      zoom: 11
    });

    // 添加标记点
    const marker = await map.addMarker({
      position: [116.397428, 39.90923],
      title: 'Beijing Tiananmen',
      content: 'OpenLayers Marker'
    });

    console.log('OpenLayers初始化成功');
    return map;
  } catch (error) {
    console.error('OpenLayers初始化失败:', error);
  }
}

// 示例4: 动态切换地图提供者
class MapManager {
  private currentMap: MapSDK | null = null;

  async switchProvider(provider: MapProvider, containerId: string) {
    // 销毁当前地图
    if (this.currentMap) {
      this.currentMap.destroy();
    }

    // 创建新地图
    this.currentMap = new MapSDK(provider);
    
    await this.currentMap.init({
      container: containerId,
      center: [116.397428, 39.90923],
      zoom: 11
    });

    console.log(`切换到 ${provider} 地图`);
  }

  async addMarkerToCurrentMap(config: MarkerConfig) {
    if (!this.currentMap) {
      throw new Error('没有活动的地图实例');
    }
    return await this.currentMap.addMarker(config);
  }

  getCurrentMap() {
    return this.currentMap;
  }
}

// 示例5: 批量操作标记点
async function batchMarkerOperations() {
  const map = new MapSDK(MapProvider.AMAP);
  
  await map.init({
    container: 'batch-container',
    center: [116.397428, 39.90923],
    zoom: 11
  });

  // 批量添加标记点
  const positions = [
    [116.397428, 39.90923],
    [116.407428, 39.91923],
    [116.387428, 39.89923],
    [116.417428, 39.92923]
  ];

  const markers: IMarker[] = [];
  for (let i = 0; i < positions.length; i++) {
    const marker = await map.addMarker({
      position: positions[i] as [number, number],
      title: `标记点 ${i + 1}`,
      content: `这是第 ${i + 1} 个标记点`
    });
    markers.push(marker);
  }

  // 批量更新标记点
  setTimeout(() => {
    markers.forEach((marker, index) => {
      marker.setTitle(`更新后的标记点 ${index + 1}`);
    });
  }, 2000);

  // 批量移除标记点
  setTimeout(() => {
    markers.forEach(marker => {
      marker.remove();
    });
  }, 5000);

  return map;
}

// 示例6: 错误处理和重试机制
async function robustMapInitialization(provider: MapProvider, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const map = new MapSDK(provider);
      
      await map.init({
        container: 'robust-container',
        center: [116.397428, 39.90923],
        zoom: 11
      });

      console.log(`地图初始化成功 (尝试 ${attempt}/${maxRetries})`);
      return map;
    } catch (error) {
      console.error(`地图初始化失败 (尝试 ${attempt}/${maxRetries}):`, error);
      
      if (attempt === maxRetries) {
        throw new Error(`地图初始化失败，已重试 ${maxRetries} 次`);
      }
      
      // 等待一段时间后重试
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
}

// 示例7: 检查支持的地图提供者
function checkSupportedProviders() {
  const supportedProviders = MapSDK.getSupportedProviders();
  console.log('支持的地图提供者:', supportedProviders);

  const testProviders = [MapProvider.AMAP, MapProvider.GOOGLE, MapProvider.OPENLAYERS];
  
  testProviders.forEach(provider => {
    const isSupported = MapSDK.isProviderSupported(provider);
    console.log(`${provider} 是否支持: ${isSupported}`);
  });
}

// 运行示例
async function runExamples() {
  console.log('=== Map SDK 使用示例 ===');
  
  // 检查支持的提供者
  checkSupportedProviders();
  
  // 运行各种示例
  await useAMap();
  await useGoogleMaps();
  await useOpenLayers();
  
  // 测试地图管理器
  const mapManager = new MapManager();
  await mapManager.switchProvider(MapProvider.AMAP, 'manager-container');
  
  // 测试批量操作
  await batchMarkerOperations();
  
  // 测试错误处理
  try {
    await robustMapInitialization(MapProvider.AMAP);
  } catch (error) {
    console.error('鲁棒性测试失败:', error);
  }
}

// 如果直接运行此文件，则执行示例
if (typeof window !== 'undefined') {
  // 浏览器环境
  window.addEventListener('DOMContentLoaded', runExamples);
} else {
  // Node.js 环境
  runExamples().catch(console.error);
}

export {
  useAMap,
  useGoogleMaps,
  useOpenLayers,
  MapManager,
  batchMarkerOperations,
  robustMapInitialization,
  checkSupportedProviders
}; 