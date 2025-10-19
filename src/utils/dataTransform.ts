/**
 * 数据转换工具函数
 * 用于将后端返回的数据格式转换为前端图表组件需要的格式
 */

/**
 * 将品种类型分布数据转换为图表需要的格式
 * @param apiResponse 后端API返回的数据
 * @returns 转换后的图表数据
 */
export function transformVarietyDistributionData(apiResponse: {
  type: number;
  code: string;
  msg: string;
  data: Array<{
    type: string;
    count: number;
  }>;
}) {
  if (!apiResponse || !apiResponse.data) {
    return [];
  }

  return apiResponse.data.map(item => ({
    name: item.type,
    value: item.count,
    subTypes: item.type, // 保持原有的subTypes字段
  }));
}

/**
 * 将品种类型分布数据转换为饼图需要的格式
 * @param apiResponse 后端API返回的数据
 * @returns 转换后的饼图数据
 */
export function transformVarietyDistributionForPieChart(apiResponse: {
  type: number;
  code: string;
  msg: string;
  data: Array<{
    type: string;
    count: number;
  }>;
}) {
  if (!apiResponse || !apiResponse.data) {
    return [];
  }

  return apiResponse.data.map(item => ({
    name: item.type,
    value: item.count,
  }));
}

/**
 * 将品种类型分布数据转换为柱状图需要的格式
 * @param apiResponse 后端API返回的数据
 * @returns 转换后的柱状图数据
 */
export function transformVarietyDistributionForBarChart(apiResponse: {
  type: number;
  code: string;
  msg: string;
  data: Array<{
    type: string;
    count: number;
  }>;
}) {
  if (!apiResponse || !apiResponse.data) {
    return {
      categories: [],
      series: []
    };
  }

  return {
    categories: apiResponse.data.map(item => item.type),
    series: [{
      name: '数量',
      data: apiResponse.data.map(item => item.count)
    }]
  };
}

/**
 * 检查API响应是否成功
 * @param apiResponse 后端API返回的数据
 * @returns 是否成功
 */
export function isApiResponseSuccess(apiResponse: {
  type: number;
  code: string;
  msg: string;
  data?: any;
}) {
  return apiResponse && apiResponse.code === '0' && apiResponse.msg === 'SUCCESS';
}
