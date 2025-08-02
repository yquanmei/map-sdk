const { MapSDK, MapProvider } = require('./dist/index.js');

console.log('=== 测试导出 ===');
console.log('MapSDK:', typeof MapSDK);
console.log('MapProvider:', MapProvider);
console.log('MapProvider.AMAP:', MapProvider.AMAP);
console.log('MapProvider.GOOGLE:', MapProvider.GOOGLE);
console.log('MapProvider.OPENLAYERS:', MapProvider.OPENLAYERS);

// 测试创建实例
try {
  const map = new MapSDK(MapProvider.AMAP);
  console.log('✅ 成功创建MapSDK实例');
} catch (error) {
  console.log('❌ 创建MapSDK实例失败:', error.message);
} 