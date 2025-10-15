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

    const columns = [
        {
            title: '杂交计划ID',
            dataIndex: 'hybridPlanId',
            key: 'hybridPlanId',
        },
    ]
    return (
        <PageContainer
          header={{
          title: '杂交计划配组',
      }}>
            <ProTable
                columns={columns}
                dataSource={dataSource}
                pagination={pagination}
                rowKey={(record) => record.id}
            />
        </PageContainer>
    );
};
export default HybridPlan;