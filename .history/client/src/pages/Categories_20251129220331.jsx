import { useEffect, useState } from "react";
import { Button, Table, message, Space, Popconfirm, Tag, Upload } from "antd";
import { DeleteOutlined, FileExcelOutlined, UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = async () => {
    setLoading(true);
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3000/api/categories", {
            headers: { Authorization: "Bearer " + token },
        });
        setCategories(response.data.data);
    } catch (error) {
        if (error.response?.status === 401) navigate("/");
    } finally {
        setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.post("http://localhost:3000/api/categories/export", {}, {
            headers: { Authorization: "Bearer " + token },
            responseType: 'blob', 
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `categories_${Date.now()}.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        
        message.success("Excel dosyası indirildi!");
    } catch (error) {
        message.error("Export işlemi başarısız!");
    }
  };

  // --- IMPORT (DOSYA YÜKLEME) İŞLEMİ ---
  const handleImport = async (file) => {
      try {
        const token = localStorage.getItem("token");
        
        // Dosya gönderirken FormData kullanmalıyız
        const formData = new FormData();
        formData.append("pb_file", file); // Backend'de 'pb_file' adıyla bekliyoruz

        await axios.post("http://localhost:3000/api/categories/import", formData, {
            headers: { 
                Authorization: "Bearer " + token,
                "Content-Type": "multipart/form-data" // Dosya gönderdiğimizi belirtiyoruz
            },
        });

        message.success("Kategoriler başarıyla yüklendi!");
        getCategories(); // Listeyi yenile
        return false; // Upload bileşeninin varsayılan davranışını durdur

      } catch (error) {
          console.error(error);
          message.error("Yükleme başarısız!");
      }
  };

  const handleDelete = async (id) => {
      try {
        const token = localStorage.getItem("token");
        await axios.post("http://localhost:3000/api/categories/delete", { _id: id }, {
          headers: { Authorization: "Bearer " + token },
        });
        message.success("Kategori silindi.");
        getCategories();
      } catch (error) {
        message.error("Silme başarısız!");
      }
  }

  const columns = [
    { title: 'Kategori Adı', dataIndex: 'name', key: 'name' },
    { 
        title: 'Durum', dataIndex: 'is_active', key: 'is_active', 
        render: (active) => <Tag color={active ? "green" : "red"}>{active ? "Aktif" : "Pasif"}</Tag> 
    },
    { title: 'Oluşturan', dataIndex: 'created_by', key: 'created_by' },
    {
        title: 'İşlemler',
        key: 'action',
        render: (_, record) => (
          <Space size="middle">
            <Popconfirm title="Silmek istiyor musun?" onConfirm={() => handleDelete(record._id)}>
              <Button type="primary" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Space>
        ),
      },
  ];

  return (
    <div>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
            <h2>Kategoriler</h2>
            
            <Space>
                {/* IMPORT BUTONU */}
                <Upload 
                    beforeUpload={handleImport} // Dosya seçilince buraya git
                    showUploadList={false} // Listeyi gösterme, direkt yükle
                    accept=".xlsx, .xls" // Sadece Excel kabul et
                >
                    <Button type="primary" icon={<UploadOutlined />} style={{ backgroundColor: '#fa8c16' }}>
                        Excel Yükle
                    </Button>
                </Upload>

                {/* EXPORT BUTONU */}
                <Button type="primary" icon={<FileExcelOutlined />} style={{ backgroundColor: '#217346' }} onClick={handleExport}>
                    Excel İndir
                </Button>
            </Space>
        </div>
        <Table dataSource={categories} columns={columns} loading={loading} rowKey="_id" />
    </div>
  );
};

export default Categories;