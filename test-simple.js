const { MapSDK, MapProvider } = require('./dist/index.js');

console.log('=== Map SDK 简单测试 ===');

// 测试支持的提供者
console.log('支持的地图提供者:', MapSDK.getSupportedProviders());

// 测试提供者支持检查
console.log('AMAP 是否支持:', MapSDK.isProviderSupported(MapProvider.AMAP));
console.log('GOOGLE 是否支持:', MapSDK.isProviderSupported(MapProvider.GOOGLE));
console.log('OPENLAYERS 是否支持:', MapSDK.isProviderSupported(MapProvider.OPENLAYERS));

// 测试创建地图实例
(async () => {
  try {
    const map = new MapSDK(MapProvider.AMAP);
    console.log('✅ 成功创建 AMAP 地图实例');
    
    // 测试未初始化时的错误
    try {
      await map.addMarker({
        position: [116.397428, 39.90923],
        title: 'Test'
      });
    } catch (error) {
      console.log('✅ 正确捕获未初始化错误:', error.message);
    }
    
  } catch (error) {
    console.log('❌ 创建地图实例失败:', error.message);
  }
})();

// 测试不支持的提供者
try {
  new MapSDK('unsupported');
} catch (error) {
  console.log('✅ 正确捕获不支持的提供者错误:', error.message);
}

console.log('=== 测试完成 ==='); 