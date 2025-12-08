//多亲回交
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, message, Modal, Upload } from 'antd';
import { ExportOutlined, ImportOutlined } from '@ant-design/icons';
import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from '@umijs/max';
import * as dayjs from 'dayjs';

const MultiParentBackcross: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);
  const [file, setFile] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
    const location = useLocation();

    const handleTableChange = (pagination: any, filters: any, sorter: any) => {
        console.log(pagination, filters, sorter);
    }

    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
      },
    ];


    const pagination = {
        pageSize: 10,
        total: 100,
    }
    return (
        <PageContainer>
            <ProTable
                columns={columns}
                pagination={pagination}
                rowKey={(record) => record.id}
                onChange={handleTableChange}
            />
        </PageContainer>
    );
}

export default MultiParentBackcross;