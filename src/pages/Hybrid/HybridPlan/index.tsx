//杂交计划配组
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, message, Modal, Upload } from 'antd';
import { ExportOutlined, ImportOutlined } from '@ant-design/icons';
import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from '@umijs/max';
import * as dayjs from 'dayjs';

const HybridPlan: React.FC = () => {
    const [dataSource, setDataSource] = useState<any[]>([]);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
    const location = useLocation();
    const [importExcelModalOpen, setImportExcelModalOpen] = useState(false);
      const [uploading, setUploading] = useState(false);
        const token = localStorage.getItem('token');

    const columns = [
        {
            title: '杂交计划ID',
            dataIndex: 'hybridPlanId',
            key: 'hybridPlanId',
        },
    ]

    const fetchHybridPlans = async (page: number, pageSize: number) => {
        try {
            const response = await fetch(`/api/hybrid/plans?page=${page}&pageSize=${pageSize}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            setDataSource(data.content || []);
            setPagination({
                current: data.number + 1,
                pageSize: data.size,
                total: data.totalElements,
            });
        } catch (error) {
            console.error('获取杂交计划配组数据失败:', error);
            message.error('获取杂交计划配组数据失败');
        }
    };

    useEffect(() => {
        fetchHybridPlans(pagination.current, pagination.pageSize);
    }, []);

      const handleImportExcel = async (formData: FormData) => {
        setUploading(true);
        try {
          const response = await fetch('/api/seed/Hybridizationimport', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            },
            body: formData,
          });
    
          if (!response.ok) {
            throw new Error('导入失败');
          }
    
          const result = await response.json();
          if (result.msg || result.code === 200) {
            message.success('导入成功');
            setImportExcelModalOpen(false);
            // 重新加载数据
            fetchHybridPlans(pagination.current, pagination.pageSize);
          } else {
            message.error(result.message || '导入失败');
          }
        } catch (error) {
          console.error('导入失败:', error);
          message.error('导入失败，请检查文件格式');
        } finally {
          setUploading(false);
        }
      };
    
    return (
        <PageContainer
          header={{
          title: '杂交计划配组',
      }}>
        <div style={{marginBottom: 16, marginRight: 16, float: 'right'}}>
            <Button type="primary" icon={<ImportOutlined /> } onClick={() => setImportExcelModalOpen(true)}>导入杂交计划配组</Button>
        </div>
        <div style={{marginBottom: 16, marginRight: 16, float: 'right'}}>
            <Button type="primary" icon={<ExportOutlined />}>导出杂交计划配组</Button>
        </div>
            <ProTable
                columns={columns}
                dataSource={dataSource}
                pagination={pagination}
                rowKey={(record) => record.id}
            />

            <Modal
                title="导入杂交计划配组"
                open={importExcelModalOpen}
                onCancel={() => {setImportExcelModalOpen(false)}}
                onOk={() => {setImportExcelModalOpen(false)}}
                >
                <div style={{ background: '#fafafa', padding: '24px', borderRadius: '8px', marginBottom: '24px' }}>
                  <Upload
                    accept=".xlsx,.xls"
                    showUploadList={false}
                    beforeUpload={file => {
                    const formData = new FormData();
                    formData.append('file', file);
                    handleImportExcel(formData);
                    return false;
                    }}
                  >
                    <Button icon={<ImportOutlined />} loading={uploading} disabled={uploading}>
                      {uploading ? '上传中...' : '导入Excel'}
                    </Button>
                  </Upload>
                </div>
               <div style={{ background: '#f6ffed', padding: '16px', borderRadius: '8px', border: '1px solid #b7eb8f' }}>
                <h4 style={{ color: '#52c41a', marginTop: 0 }}>注意事项：</h4>
                 <ul style={{ color: '#666', marginBottom: 0 }}>
                  <li>请使用标准Excel模板进行导入</li>
                  <li>Excel文件大小不能超过10MB</li>
                  <li>表格中的必填字段不能为空</li>
                  <li>日期格式请使用YYYY-MM-DD格式</li>
                 </ul>
               </div>
            </Modal>
        </PageContainer>
    );
};
export default HybridPlan;