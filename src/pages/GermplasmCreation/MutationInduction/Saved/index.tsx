import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, message, Modal, Space } from 'antd';
import { ExportOutlined, DeleteOutlined } from '@ant-design/icons';
import React, { useEffect, useState, useRef } from 'react';
import * as dayjs from 'dayjs';

const Saved : React.FC = () => {
    const [dataSource, setDataSource] = useState<any[]>([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
    const [pagination, setPagination] = useState({
      total: 0,
      current: 1,
      pageSize: 10,
    });

    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
      },
    ]

    const fetchData = async (page: number, pageSize: number) => {
      try {
        const response = await fetch(`/api/germplasm/multi-parent-backcross/saved?page=${page}&pageSize=${pageSize}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        if (data.code === 200) {
          setDataSource(data.data);
          setPagination({
            total: data.total,
            current: page,
            pageSize,
          });
        } else {
          message.error(data.message || '获取数据失败');
        }
      } catch (error) {
        console.error('获取数据失败:', error);
        message.error('获取数据失败，请稍后重试');
      }
    };

    useEffect(() => {
      fetchData (pagination.current, pagination.pageSize);
    }, []);
  return (
    <PageContainer>
      <ProTable
        columns={columns}
        dataSource={dataSource}
        rowKey={(record) => record.key}
        pagination={pagination}
        scroll={{ x: 1600 }}
      /></PageContainer>
  );
};

export default Saved;