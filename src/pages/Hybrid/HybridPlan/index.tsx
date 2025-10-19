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
                <Upload><Button type="primary" icon={<ImportOutlined />}>上传文件</Button></Upload>
            </Modal>
        </PageContainer>
    );
};
export default HybridPlan;