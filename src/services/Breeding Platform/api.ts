// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';
import { generateMockData } from './mockData';

/** 获取当前的用户 GET /api/currentUser */
export async function currentUser(options?: { [key: string]: any }) {
  const token = localStorage.getItem('token');
  
  // 如果没有token，返回undefined而不是跳转登录页
  if (!token) {
    return {
      data: undefined
    };
  }

  try {
    return await request<{
      data: API.CurrentUser;
    }>('/api/currentUser', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      ...(options || {}),
    });
  } catch (error) {
    // 如果token无效，清除localStorage中的token
    // localStorage.removeItem('token');
    return {
      data: undefined
    };
  }
}

/** 退出登录接口 POST /api/login/outLogin */
export async function outLogin(options?: { [key: string]: any }) {
  const token = localStorage.getItem('token');
  return request<Record<string, any>>('/api/login/outLogin', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    ...(options || {}),
  });
}

/** 登录接口 POST /api/login/account */
// export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
//   return request<API.LoginResult>('/api/login/account', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     data: body,
//     ...(options || {}),
//   });
// }

/** 此处后端没有提供注释 GET /api/notices */
export async function getNotices(options?: { [key: string]: any }) {
  return request<API.NoticeIconList>('/api/notices', {
    method: 'GET',
    ...(options || {}),
  });
}

export const mockData = generateMockData();

/** 获取规则列表 GET /api/rule */
export async function rule(
  params: {
    current?: number;
    pageSize?: number;
    [key: string]: any;
  },
  options?: { [key: string]: any },
) {
    return request('/api/rule', {
      method: 'GET',
      params: {
        ...params,
      },
      ...(options || {}),
    });
}

/** 更新规则 PUT /api/rule */
export async function updateRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rul', {
    method: 'POST',
    data:{
      method: 'update',
      ...(options || {}),
    }
  });
}

/** 新建规则 POST /api/rule */
export async function addRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    data:{
      method: 'post',
      ...(options || {}),
    }
  });
}

/** 删除规则 DELETE /api/rule */
export async function removeRule(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/rule', {
    method: 'POST',
    data:{
      method: 'delete',
      ...(options || {}),
    }
  });
}

/** 保存种子到留种页面 POST /api/save-seed */
export async function saveSeed(body: {
  varietyName: string;
  type: string;
  seedNumber: string;
  photo: string;
  source: string;
  plantingYear: string;
  [key: string]: any;
}, options?: { [key: string]: any }) {
  const token = localStorage.getItem('token');
  return request<API.RuleListItem>('/api/save-seed', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    data: body,
    ...(options || {}),
  });
}

/** 导入Excel POST /api/import-excel */
// 导出一个异步函数，用于导入Excel文件
export async function importExcel(formData: FormData) {
  // const tokenValue = localStorage.getItem('token');
  const token = localStorage.getItem('token');

  // 发送POST请求，请求地址为'/api/seed/Seedimport'，请求方法为POST，请求参数为formData
  return request<{
    data: API.RuleListItem[]; // 返回的数据类型为API.RuleListItem数组
    success: boolean; // 返回的成功状态
    message?: string; // 返回的消息
  }>('/api/seed/Seedimport', {
    method: 'POST',
    data: formData,
  });
}

// Deepseek API配置
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const DEEPSEEK_API_KEY = 'sk-04fb3dc9fa9c4fd6a0afad0223a55926';

export async function queryAI(messages: { role: string; content: string }[]) {
  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer sk-04fb3dc9fa9c4fd6a0afad0223a55926`,
      },
      body: JSON.stringify({
        model: 'deepseek-reasoner',
        messages: messages,
        temperature: 0.7,
        max_tokens: 6000,
      }),
    });

    if (!response.ok) {
      throw new Error(`请求失败: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      data: data.choices[0].message.content,
    };
  } catch (error) {
    console.error('AI API Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '未知错误',
    };
  }
}

/** 保存播种记录 POST /api/seed/sow */
export async function saveSowingRecord(body: {
  id: string;
  code: string;
  seedNumber: string;
  varietyName: string;
  sowingCount: number;
  planNumber: string;
  createTime: string;
}, options?: { [key: string]: any }) {
  const token = localStorage.getItem('token');
  return request<Record<string, any>>('/api/seed/sow', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    data: body,
    ...(options || {}),
  });
}

/** 保存留种记录 POST /api/seed/save */
export async function saveSeedRecord(body: {
  key?: number;
  photo1?: string;
  photo2?: string;
  varietyName: string;
  type: string;
  introductionYear: string;
  source: string;
  breedingType: string;
  seedNumber: string;
  plantingYear: string;
  resistance: string;
  fruitCharacteristics: string;
  floweringPeriod: string;
  fruitCount: number;
  yield: number;
  fruitShape: string;
  skinColor: string;
  fleshColor: string;
  singleFruitWeight: number;
  fleshThickness: number;
  sugarContent: number;
  texture: string;
  overallTaste: string;
  combiningAbility: string;
  hybridization: string;
  saveTime: string;
}, options?: { [key: string]: any }) {
  const token = localStorage.getItem('token');
  return request<Record<string, any>>('/api/seed/reserve', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    data: body,
    ...(options || {}),
  });
}

/** 检查种子是否存在 GET /api/seed/check */
export async function checkSeedExists(params: {
  seedNumber: string;
}, options?: { [key: string]: any }) {
  const token = localStorage.getItem('token');
  return request<{
    exists: boolean;
    message: string;
  }>('/api/seed/check', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 删除播种记录 DELETE /api/seed/sow */
export async function deleteSowingRecord(params: {
  plantid: string;
}, options?: { [key: string]: any }) {
  const token = localStorage.getItem('token');
  return request<Record<string, any>>('/api/seed/sowdelete', {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 批量删除播种记录 DELETE /api/seed/sow/batch */
export async function batchDeleteSowingRecords(params: {
  ids: string[];
}, options?: { [key: string]: any }) {
  const token = localStorage.getItem('token');
  return request<Record<string, any>>('/api/seed/BatchDeleteSow', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 用户注册 */
export async function register(body: API.RegisterParams, options?: { [key: string]: any }) {
  return request<API.RegisterResult>('/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 用户登录 */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<API.LoginResult>('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 图片OCR识别 */
export async function imageOcr(file: File) {
  const token = localStorage.getItem('token');
  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await fetch('/api/ocr/image', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error(`OCR请求失败: ${response.status}`);
    }

    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
      return response.json();
    } else {
      const text = await response.text();
      return { text };
    }
  } catch (error) {
    console.error('OCR识别失败:', error);
    throw error;
  }
}

/** QQ登录接口 */
export async function qqLogin(body: {
  accessToken: string;
  openId: string;
  [key: string]: any;
}, options?: { [key: string]: any }) {
  return request<API.LoginResult>('/api/auth/qq-login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 微信登录接口 */
export async function wechatLogin(body: {
  code: string;
  state?: string;
  [key: string]: any;
}, options?: { [key: string]: any }) {
  return request<API.LoginResult>('/api/auth/wechat-login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 支付宝登录接口 */
export async function alipayLogin(body: {
  authCode: string;
  state?: string;
  [key: string]: any;
}, options?: { [key: string]: any }) {
  return request<API.LoginResult>('/api/auth/alipay-login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// ==================== 仪表板数据 API ====================

/** 获取仪表板统计数据 GET /api/dashboard/statistics */
export async function getDashboardStatistics(options?: { [key: string]: any }) {
  const token = localStorage.getItem('token');
  return request<{
    totalVarieties: number;
    newThisYear: number;
    seedReserves: number;
    successRate: number;
  }>('/api/dashboard/statistics', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    ...(options || {}),
  });
}

/** 获取地域品种分布数据 GET /api/Data/type */
export async function getRegionalDistribution(options?: { [key: string]: any }) {
  const token = localStorage.getItem('token');
  return request<{
    type: number;
    code: string;
    msg: string;
    data: Array<{
      type: string;
      count: number;
    }>;
  }>('/api/Data/type', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    ...(options || {}),
  });
}


/** 获取糖度分布数据 GET /api/dashboard/sweetness-distribution */
export async function getSweetnessDistribution(options?: { [key: string]: any }) {
  const token = localStorage.getItem('token');
  return request<Array<{
    range: string;
    count: number;
    percentage: number;
  }>>('/api/dashboard/sweetness-distribution', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    ...(options || {}),
  });
}


// ==================== 新增：图表数据接口占位（后端待实现） ====================

/** 品种糖度对比 GET /api/Data/sugar */
export async function getVarietySugarComparison(options?: { [key: string]: any }) {
  const token = localStorage.getItem('token');
  return request<{
    type: number;
    code: string;
    msg: string;
    data: Array<{ type: string; sugar: number }>;
  }>('/api/Data/sugar', {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` },
    ...(options || {}),
  });
}

/** 品种综合评分（糖度、肉厚、产量、抗性）GET /api/dashboard/composite-scores */
export async function getVarietyCompositeScores(options?: { [key: string]: any }) {
  const token = localStorage.getItem('token');
  return request<Array<{ name: string; 糖度: number; 肉厚: number; 产量: number; 抗性: number }>>('/api/dashboard/composite-scores', {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` },
    ...(options || {}),
  });
}

/** 杂交组合抗病性分布 GET /api/dashboard/hybrid-disease */
export async function getHybridDiseaseResistance(options?: { [key: string]: any }) {
  const token = localStorage.getItem('token');
  return request<{ diseases: string[]; combinations: string[]; values: Array<[number, number, number]> }>('/api/dashboard/hybrid-disease', {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` },
    ...(options || {}),
  });
}

/** 糖度与产量关系 GET /api/Data/sugarYield2 */
export async function getSugarYieldPairs(options?: { [key: string]: any }) {
  const token = localStorage.getItem('token');
  return request<{
    type: number;
    code: string;
    msg: string;
    data: Array<{ type: string; sugar: number; yield: number }>;
  }>('/api/Data/sugarYield2', {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` },
    ...(options || {}),
  });
}

/** 杂交组合来源关系（桑基）GET /api/dashboard/hybrid-sankey */
export async function getHybridSankey(options?: { [key: string]: any }) {
  const token = localStorage.getItem('token');
  return request<{ nodes: Array<{ name: string }>; links: Array<{ source: string; target: string; value: number }> }>('/api/dashboard/hybrid-sankey', {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` },
    ...(options || {}),
  });
}

/** 引种时间分布 GET /api/Data/introductionTime */
export async function getIntroductionTimeline(options?: { [key: string]: any }) {
  const token = localStorage.getItem('token');
  return request<{
    type: number;
    code: string;
    msg: string;
    data: Array<{ count: number; introductionTime: string }>;
  }>('/api/Data/introductionTime', {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` },
    ...(options || {}),
  });
}

/** 跨表同品种特性对比 GET /api/Data/sugarYield1 */
export async function getCrossTableVarietyCompare(options?: { [key: string]: any }) {
  const token = localStorage.getItem('token');
  return request<{
    type: number;
    code: string;
    msg: string;
    data: Array<{ sugar: number; yield: number }>;
  }>('/api/Data/sugarYield1', {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` },
    ...(options || {}),
  });
}