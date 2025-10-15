import { PageContainer } from '@ant-design/pro-components';
import { Card, Row, Col, Statistic, Typography, Space, Button, message, Spin } from 'antd';
import React, { useEffect, useState, useCallback } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, LineChart, Line, RadarChart, Radar, 
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, AreaChart, Area
} from 'recharts';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';
import { PlayCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { 
  getAllDashboardData
} from '@/services/Breeding Platform/api';

const { Title, Paragraph } = Typography;

// 定义数据类型
interface VarietyItem {
  name: string;
  value: number;
  subTypes: string;
}

interface IntroductionItem {
  year: string;
  count: number;
  success: number;
  rate: number;
  spring: number;
  summer: number;
  autumn: number;
  winter: number;
}

interface PerformanceItem {
  subject: string;
  A: number;
  B: number;
  C: number;
  fullMark: number;
}

interface GrowthCycleItem {
  name: string;
  西瓜: number;
  甜瓜: number;
  南瓜: number;
  黄瓜: number;
}

interface YieldEnvironmentItem {
  temperature: number;
  humidity: number;
  yield: number;
  name: string;
}

interface RegionVarietyItem {
  name: string;
  varieties: Array<{
    name: string;
    count: number;
  }>;
}

interface DetailedTypeItem {
  name: string;
  subtypes: Array<{
    name: string;
    count: number;
  }>;
}

interface SweetnessItem {
  range: string;
  count: number;
  percentage: number;
}

const Welcome: React.FC = () => {
  // 状态管理
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState({
    statistics: {
      totalVarieties: 0,
      newThisYear: 0,
      seedReserves: 0,
      successRate: 0,
    },
    varietyData: [] as VarietyItem[],
    introductionData: [] as IntroductionItem[],
    performanceData: [] as PerformanceItem[],
    growthCycleData: [] as GrowthCycleItem[],
    yieldEnvironmentData: [] as YieldEnvironmentItem[],
    regionVarietyData: [] as RegionVarietyItem[],
    detailedTypeData: [] as DetailedTypeItem[],
    sweetnessData: [] as SweetnessItem[],
  });

  // 获取所有仪表板数据
  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAllDashboardData();
      if (response) {
        setData({
          statistics: response.statistics || data.statistics,
          varietyData: response.varietyDistribution || [],
          introductionData: response.introductionTrend || [],
          performanceData: response.performanceData || [],
          growthCycleData: response.growthCycleData || [],
          yieldEnvironmentData: response.yieldEnvironmentData || [],
          regionVarietyData: response.regionalDistribution || [],
          detailedTypeData: response.detailedTypes || [],
          sweetnessData: response.sweetnessData || [],
        });
      }
    } catch (error) {
      console.error('获取仪表板数据失败:', error);
      message.error('获取数据失败，请刷新页面重试');
    } finally {
      setLoading(false);
    }
  }, []);

  // 刷新数据
  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchAllData();
      message.success('数据已刷新');
    } catch (error) {
      message.error('刷新失败，请重试');
    } finally {
      setRefreshing(false);
    }
  };

  // 组件挂载时获取数据
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // 设置定时刷新（每5分钟）
  useEffect(() => {
    const interval = setInterval(() => {
      fetchAllData();
    }, 5 * 60 * 1000); // 5分钟

    return () => clearInterval(interval);
  }, [fetchAllData]);

  // 添加：产量与温度关系图表配置
  const yieldTempChartOption: EChartsOption = {
    title: {
      text: '产量与环境关系分析',
      textStyle: {
        color: '#2E7D32',
        fontSize: '16px',
        fontWeight: 'normal'
      }
    },
    tooltip: {
      trigger: 'axis',
      formatter: '{b}: {c}%'
    },
    xAxis: {
      type: 'category',
      data: data.yieldEnvironmentData.map(item => item.name),
      name: '产量温度(°C)',
      nameLocation: 'middle',
      nameGap: 30,
      axisLabel: {
        color: '#666'
      }
    },
    yAxis: {
      type: 'value',
      name: '湿度(%)',
      min: 0,
      max: 80,
      interval: 20,
      axisLabel: {
        formatter: '{value}%',
        color: '#666'
      }
    },
    series: [{
      data: data.yieldEnvironmentData.map(item => item.yield),
      type: 'scatter',
      symbolSize: 20,
      itemStyle: {
        color: '#2E7D32'
      }
    }]
  };

  // 这些数据现在从后端获取，不再使用静态数据

  // 更新主题配色
  const THEME_COLORS = {
    pieChart: [
      '#2E7D32', // 深绿
      '#43A047', // 中深绿
      '#66BB6A', // 中绿
      '#81C784', // 浅绿
      '#A5D6A7'  // 更浅绿
    ],
    gradients: [
      'linear-gradient(135deg, #2E7D32 0%, #43A047 100%)',
      'linear-gradient(135deg, #43A047 0%, #66BB6A 100%)',
      'linear-gradient(135deg, #66BB6A 0%, #81C784 100%)',
      'linear-gradient(135deg, #81C784 0%, #A5D6A7 100%)',
      'linear-gradient(135deg, #A5D6A7 0%, #C8E6C9 100%)'
    ]
  };

  const CHART_COLORS = {
    primary: '#2E7D32',
    secondary: '#43A047',
    accent: '#66BB6A',
    light: '#E8F5E9',
    tertiary: '#81C784',
    gradient: {
      primary: 'linear-gradient(135deg, #2E7D32 0%, #43A047 100%)',
      secondary: 'linear-gradient(135deg, #43A047 0%, #66BB6A 100%)'
    }
  };

  // 更新卡片样式
  const cardStyle = {
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    border: 'none',
    transition: 'all 0.3s ease',
    ':hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)'
    }
  };

  const headerStyle = {
    background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 50%, #43A047 100%)',
    borderRadius: '16px',
    padding: '32px',
    marginBottom: '32px',
    color: '#fff',
    textAlign: 'center' as const,
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
  };

  // 更新统计卡片样式
  const statisticCardStyle = {
    ...cardStyle,
    background: '#FFFFFF',
    padding: '24px',
    height: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    alignItems: 'center',
    transition: 'all 0.3s ease',
    ':hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 8px 30px rgba(46, 125, 50, 0.15)'
    }
  };

  // 更新图表卡片样式
  const chartCardStyle = {
    ...cardStyle,
    padding: '24px',
    background: '#FFFFFF',
    '& .ant-card-head': {
      borderBottom: 'none',
      padding: '0 0 16px 0'
    },
    '& .ant-card-head-title': {
      fontSize: '18px',
      fontWeight: '600'
    }
  };

  // 修改地图数据加载
  useEffect(() => {
    // 加载湖州市及其区县地图数据
    fetch('https://geo.datav.aliyun.com/areas_v3/bound/330500_full.json')
      .then(response => response.json())
      .then(geoJson => {
        // 处理地理数据以适应显示需求
        const features = geoJson.features.map((feature: any) => {
          // 简化区县名称，去掉"市辖区"等后缀
          const name = feature.properties.name;
          feature.properties.name = name
            .replace('市辖区', '')
            .replace('区', '')
            .replace('县', '');
          return feature;
        });
        
        // 更新处理后的地理数据
        const processedGeoJson = {
          ...geoJson,
          features
        };

        // 注册地图数据
        echarts.registerMap('huzhou', processedGeoJson);
      })
      .catch(error => {
        console.error('加载地图数据失败:', error);
        message.error('地图数据加载失败，请刷新页面重试');
      });
  }, []);

  // 修改地图配置
  const mapOption: EChartsOption = {
    title: {
      text: '湖州市各区种子分布',
      left: 'center',
      textStyle: {
        color: '#2E7D32',
        fontSize: '18px',
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        const regionData = data.regionVarietyData.find(item => item.name === params.name);
        if (regionData) {
          const varietiesHtml = regionData.varieties
            .map(v => `${v.name}: ${v.count}个`)
            .join('<br/>');
          return `
            <div style="font-weight: bold; margin-bottom: 5px;">${params.name}</div>
            <div style="margin-bottom: 5px;">品种详情：</div>
            ${varietiesHtml}
            <div style="margin-top: 5px;">总数：${regionData.varieties.reduce((sum, v) => sum + v.count, 0)}个</div>
          `;
        }
        return `${params.name}`;
      }
    },
    visualMap: {
      min: 0,
      max: 70,
      left: 'left',
      top: 'bottom',
      text: ['高', '低'],
      inRange: {
        color: ['#E8F5E9', '#81C784', '#2E7D32']
      },
      calculable: true
    },
    series: [
      {
        name: '种子分布',
        type: 'map',
        map: 'huzhou',
        roam: true,
        zoom: 1.2,
        label: {
          show: true,
          color: '#333',
          fontSize: 14
        },
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 1.5,
          areaColor: '#E8F5E9'
        },
        emphasis: {
          label: {
            show: true,
            color: '#fff'
          },
          itemStyle: {
            areaColor: '#43A047'
          }
        },
        data: data.regionVarietyData.map(item => ({
          name: item.name.replace('区', '').replace('县', ''),
          value: item.varieties.reduce((sum, v) => sum + v.count, 0)
        }))
      }
    ]
  };

  if (loading) {
    return (
      <PageContainer>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '60vh',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <Spin size="large" />
          <div style={{ color: '#666', fontSize: '16px' }}>正在加载数据...</div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Card style={{ marginBottom: '32px', ...cardStyle, background: 'transparent', boxShadow: 'none' }}>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={16}>
            <div style={{ 
              position: 'relative', 
              width: '100%', 
              paddingTop: '56.25%',
              background: '#000',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)'
            }}>
              <video
      style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
                controls
                poster="https://breed-1258140596.cos.ap-shanghai.myqcloud.com/Breeding%20Platform/vediopic.png"
                src="https://breed-1258140596.cos.ap-shanghai.myqcloud.com/video/xc.mp4"
              >
                您的浏览器不支持视频播放
              </video>
        </div>
          </Col>
          <Col xs={24} md={8}>
            <div style={{ 
              padding: '32px', 
              height: '100%',
              background: 'linear-gradient(135deg, #F1F8E9 0%, #E8F5E9 100%)',
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
            }}>
              <Title level={3} style={{ 
                color: '#1B5E20', 
                marginBottom: '24px',
                fontSize: '28px',
                fontWeight: '600'
              }}>
                农科院介绍
              </Title>
              <Paragraph style={{ 
                fontSize: '16px', 
                lineHeight: '1.8',
                color: '#2E7D32'
              }}>
                本视频展示了农科院工作人员的日常，包括：
              </Paragraph>
              <ul style={{ 
                fontSize: '16px', 
                lineHeight: '2',
                color: '#2E7D32',
                marginBottom: '32px'
              }}>
                <li>丰富的种质资源收集与保存</li>
                <li>智能化的种质资源管理系统</li>
                <li>专业的育种数据分析工具</li>
                <li>便捷的种质资源查询与共享</li>
              </ul>
              <Button 
                type="primary" 
                icon={<PlayCircleOutlined />}
                size="large"
          style={{
                  background: THEME_COLORS.gradients[0],
                  border: 'none',
                  height: '48px',
                  borderRadius: '24px',
            fontSize: '16px',
                  boxShadow: '0 4px 15px rgba(46, 125, 50, 0.2)'
                }}
              >
                了解更多
              </Button>
            </div>
          </Col>
        </Row>
      </Card>

      <Card style={{ ...cardStyle, marginBottom: '32px' }}>
        <div style={headerStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <Title level={2} style={{ 
                color: '#fff', 
                margin: 0,
                fontSize: '36px',
                fontWeight: '600',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
              }}>
                种质资源库数据可视化
              </Title>
              <Paragraph style={{ 
                color: '#fff', 
                margin: '16px 0 0',
                fontSize: '18px',
                opacity: 0.9
              }}>
                全面展示种质资源分布与统计信息
              </Paragraph>
            </div>
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              loading={refreshing}
              onClick={handleRefresh}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: '#fff',
                height: '40px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '500',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
              }}
            >
              刷新数据
            </Button>
          </div>
        </div>

        <Row gutter={[24, 24]}>
          <Col span={6}>
            <Card style={statisticCardStyle} hoverable styles={{ body: { padding: 0 } }}>
              <Statistic 
                title={<span style={{ fontSize: '18px', color: '#1B5E20', fontWeight: '500' }}>品种总数</span>}
                value={data.statistics.totalVarieties} 
                suffix="个"
                valueStyle={{ 
                  color: '#2E7D32', 
                  fontWeight: '600', 
                  fontSize: '36px',
                  background: THEME_COLORS.gradients[0],
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card style={statisticCardStyle} hoverable styles={{ body: { padding: 0 } }}>
              <Statistic 
                title={<span style={{ fontSize: '18px', color: '#1B5E20', fontWeight: '500' }}>本年度新增</span>}
                value={data.statistics.newThisYear} 
                suffix="个"
                valueStyle={{ 
                  color: '#43A047', 
                  fontWeight: '600', 
                  fontSize: '36px',
                  background: THEME_COLORS.gradients[1],
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card style={statisticCardStyle} hoverable styles={{ body: { padding: 0 } }}>
              <Statistic 
                title={<span style={{ fontSize: '18px', color: '#1B5E20', fontWeight: '500' }}>留种数量</span>}
                value={data.statistics.seedReserves} 
                suffix="份"
                valueStyle={{ 
                  color: '#66BB6A', 
                  fontWeight: '600', 
                  fontSize: '36px',
                  background: THEME_COLORS.gradients[2],
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card style={statisticCardStyle} hoverable styles={{ body: { padding: 0 } }}>
              <Statistic 
                title={<span style={{ fontSize: '18px', color: '#1B5E20', fontWeight: '500' }}>成功率</span>}
                value={data.statistics.successRate} 
                suffix="%"
                precision={1}
                valueStyle={{ 
                  color: '#81C784', 
                  fontWeight: '600', 
                  fontSize: '36px',
                  background: THEME_COLORS.gradients[3],
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
          <Col span={24}>
            <Card 
              style={chartCardStyle}
              title={<span style={{ 
                background: THEME_COLORS.gradients[0],
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: '20px',
                fontWeight: '600'
              }}>种子地理分布</span>}
              hoverable
            >
              <div style={{ height: 500, padding: '20px 0' }}>
                <ReactECharts 
                  option={mapOption}
                  style={{ height: '100%' }}
                  opts={{ renderer: 'svg' }}
                />
      </div>
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col span={12}>
      <Card
              style={chartCardStyle}
              title={<span style={{ 
                background: THEME_COLORS.gradients[0],
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: '18px',
                fontWeight: '600'
              }}>品种类型分布</span>}
              hoverable
            >
              <div style={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.varietyData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {data.varietyData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={THEME_COLORS.pieChart[index % THEME_COLORS.pieChart.length]}
                          stroke="#fff"
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        border: '1px solid #E8F5E9',
                        borderRadius: '4px'
                      }}
                      itemStyle={{ color: '#1B5E20' }}
                    />
                    <Legend 
                      verticalAlign="middle" 
                      align="right"
                      layout="vertical"
                      iconType="circle"
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </Col>
          <Col span={12}>
            <Card 
              style={chartCardStyle}
              title={<span style={{ 
                background: THEME_COLORS.gradients[0],
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: '18px',
                fontWeight: '600'
              }}>年度引种趋势</span>}
              hoverable
            >
              <div style={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data.introductionData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#E8F5E9" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" name="引种数量" fill={CHART_COLORS.primary} />
                    <Bar dataKey="success" name="成功数量" fill={CHART_COLORS.secondary} />
                  </BarChart>
                </ResponsiveContainer>
          </div>
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col span={12}>
            <Card 
              style={chartCardStyle}
              title={<span style={{ 
                background: THEME_COLORS.gradients[0],
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: '18px',
                fontWeight: '600'
              }}>成功率趋势</span>}
              hoverable
            >
              <div style={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={data.introductionData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#E8F5E9" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="rate" 
                      name="成功率" 
                      stroke={CHART_COLORS.primary}
                      strokeWidth={2}
                      dot={{ r: 6, fill: CHART_COLORS.primary }}
                      activeDot={{ r: 8, fill: CHART_COLORS.accent }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </Col>
          <Col span={12}>
            <Card 
              style={chartCardStyle}
              title={<span style={{ 
                background: THEME_COLORS.gradients[0],
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: '18px',
                fontWeight: '600'
              }}>品种性能评估</span>}
              hoverable
            >
              <div style={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart outerRadius={90} data={data.performanceData}>
                    <PolarGrid stroke="#E8F5E9" />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar
                      name="优质品种"
                      dataKey="A"
                      stroke={CHART_COLORS.primary}
                      fill={CHART_COLORS.primary}
                      fillOpacity={0.6}
                    />
                    <Radar
                      name="普通品种"
                      dataKey="B"
                      stroke={CHART_COLORS.secondary}
                      fill={CHART_COLORS.secondary}
                      fillOpacity={0.6}
                    />
                    <Legend />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col span={12}>
            <Card 
              style={chartCardStyle}
              title={<span style={{ 
                background: THEME_COLORS.gradients[0],
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: '18px',
                fontWeight: '600'
              }}>生长周期对比</span>}
              hoverable
            >
              <div style={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={data.growthCycleData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#E8F5E9" />
                    <XAxis dataKey="name" />
                    <YAxis label={{ value: '天数', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="西瓜" stackId="1" stroke={CHART_COLORS.primary} fill={CHART_COLORS.primary} fillOpacity={0.6} />
                    <Area type="monotone" dataKey="甜瓜" stackId="1" stroke={CHART_COLORS.secondary} fill={CHART_COLORS.secondary} fillOpacity={0.6} />
                    <Area type="monotone" dataKey="南瓜" stackId="1" stroke={CHART_COLORS.accent} fill={CHART_COLORS.accent} fillOpacity={0.6} />
                    <Area type="monotone" dataKey="黄瓜" stackId="1" stroke={CHART_COLORS.tertiary} fill={CHART_COLORS.tertiary} fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </Col>
          <Col span={12}>
            <Card 
              style={chartCardStyle}
              title={<span style={{ 
                background: THEME_COLORS.gradients[0],
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: '18px',
                fontWeight: '600'
              }}>产量与环境关系分析</span>}
              hoverable
            >
              <div style={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <ReactECharts option={yieldTempChartOption} style={{ height: '100%' }} />
                </ResponsiveContainer>
              </div>
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col span={12}>
            <Card 
              style={chartCardStyle}
              title={<span style={{ 
                background: THEME_COLORS.gradients[0],
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: '18px',
                fontWeight: '600'
              }}>品种类型详细分布</span>}
              hoverable
            >
              <div style={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data.detailedTypeData.flatMap(type => 
                      type.subtypes.map(subtype => ({
                        category: type.name,
                        name: subtype.name,
                        count: subtype.count
                      }))
                    )}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#E8F5E9" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" name="数量" fill={CHART_COLORS.primary} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </Col>
          <Col span={12}>
            <Card 
              style={chartCardStyle}
              title={<span style={{ 
                background: THEME_COLORS.gradients[0],
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: '18px',
                fontWeight: '600'
              }}>糖度分布</span>}
              hoverable
            >
              <div style={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data.sweetnessData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#E8F5E9" />
                    <XAxis dataKey="range" />
                    <YAxis yAxisId="left" orientation="left" stroke={CHART_COLORS.primary} />
                    <YAxis yAxisId="right" orientation="right" stroke={CHART_COLORS.secondary} />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="count" name="数量" fill={CHART_COLORS.primary} />
                    <Line yAxisId="right" type="monotone" dataKey="percentage" name="占比(%)" stroke={CHART_COLORS.secondary} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </Col>
        </Row>
      </Card>

      <Card style={{ ...cardStyle, marginTop: 16 }} hoverable>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <Title level={3} style={{ color: '#2E7D32', marginBottom: '24px' }}>平台特色</Title>
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Card 
                  style={{ ...cardStyle, background: '#F9FBE7' }} 
                  hoverable
                  styles={{ body: { height: '200px' } }}
                >
                  <Title level={4} style={{ color: '#2E7D32' }}>智能数据管理</Title>
                  <Paragraph style={{ fontSize: '14px', color: '#1B5E20' }}>
                    采用先进的数据管理系统，实现品种信息的智能化管理。提供完整的数据录入、查询和分析功能，
                    支持多维度的统计分析，助力科研人员做出更准确的决策。
                  </Paragraph>
                </Card>
              </Col>
              <Col span={8}>
                <Card 
                  style={{ ...cardStyle, background: '#F1F8E9' }} 
                  hoverable
                  styles={{ body: { height: '200px' } }}
                >
                  <Title level={4} style={{ color: '#2E7D32' }}>全程留种追踪</Title>
                  <Paragraph style={{ fontSize: '14px', color: '#1B5E20' }}>
                    提供完整的留种管理流程，包括种子保存、质量监控、发芽率追踪等功能。
                    实时监控种质资源状态，确保种子的安全存储和有效利用。
                  </Paragraph>
                </Card>
              </Col>
              <Col span={8}>
                <Card 
                  style={{ ...cardStyle, background: '#E8F5E9' }} 
                  hoverable
                  styles={{ body: { height: '200px' } }}
                >
                  <Title level={4} style={{ color: '#2E7D32' }}>育种分析预测</Title>
                  <Paragraph style={{ fontSize: '14px', color: '#1B5E20' }}>
                    运用大数据分析技术，对品种特性进行多维度分析。提供育种趋势预测、
                    性状关联分析等功能，为育种工作提供科学依据。
                  </Paragraph>
                </Card>
              </Col>
            </Row>
          </div>

          <div style={{ marginTop: '24px' }}>
            <Title level={3} style={{ color: '#2E7D32', marginBottom: '16px' }}>使用指南</Title>
            <Card style={{ background: '#F1F8E9', border: 'none' }}>
              <Paragraph style={{ fontSize: '14px', lineHeight: '2', color: '#1B5E20' }}>
                1. 品种管理：点击&quot;种质资源库&quot;，可以查看和管理所有品种信息。<br />
                2. 留种记录：在&quot;留种记录&quot;页面，可以记录和追踪种子保存情况。<br />
                3. 考种记载：通过&quot;考种记载表&quot;，可以详细记录种植过程中的各项指标。<br />
                4. 数据分析：系统提供多维度的数据分析工具，帮助您更好地了解品种特性。<br />
                5. 报表导出：可以导出各类统计报表，方便数据归档和分析。
              </Paragraph>
            </Card>
        </div>
        </Space>
      </Card>
    </PageContainer>
  );
};

export default Welcome;
