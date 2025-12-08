import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, message, Modal, Space } from 'antd';
import { ExportOutlined, DeleteOutlined } from '@ant-design/icons';
import React, { useEffect, useState, useRef } from 'react';
import * as dayjs from 'dayjs';

const SowingList: React.FC = () => {
    const [dataSource, setDataSource] = useState<any[]>([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
    const [pagination, setPagination] = useState({
      total: 0,
      current: 1,
      pageSize: 10,
    });

    const fetchData = async (params: any) => {
      try {
        const response = await fetch('http://localhost:3000/api/sowing', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(params),
        });
        const data = await response.json();
        setDataSource(data.data);
        setPagination({
            total: data.total,
            current: params.page,
            pageSize: params.pageSize,
        });
    } catch (error) {
      console.error('获取数据失败:', error);
      message.error('获取数据失败，请稍后重试');
    }};
  
    useEffect(() => {
        fetchData({ page: pagination.current, pageSize: pagination.pageSize });
    });

    const handleTableChange = (pagination: any, filters: any, sorter: any) => {
        fetchData({ page: pagination.current, pageSize: pagination.pageSize });
    };

  const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
      },
    ]
    return (
        <PageContainer>
            <ProTable
                columns={columns}
                dataSource={dataSource}
                pagination={pagination}
                rowKey={(record) => record.id}
                onChange={handleTableChange}
            />
        </PageContainer>
    );
};


export default SowingList;