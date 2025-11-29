import { useEffect, useState } from "react";
import { Button, Table, message, Space, Popconfirm, Tag } from "antd";
import { DeleteOutlined,  FileExcelOutlined } from "@ant-design/icons"; // EditOutlined eklenebilir
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

  // --- EXCEL EXPORT İŞLEMİ (ÖNEMLİ) ---
  const handleExport = async () => {
    try {
        const token = localStorage.getItem("token");
        // Not: Dosya indireceğimiz için responseType: 'blob' diyoruz
        const response = await axios.post("http://localhost:3000/api/categories/export", {}, {
            headers: { Authorization: "Bearer " + token },
            responseType: 'blob', 
        });

        // Tarayıcıya indirme linki oluşturup tıklatıyoruz
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `categories_${Date.now()}.xlsx`); // Dosya adı
        document.body.appendChild(link);
        link.click();
        link.remove();
        
        message.success("Excel dosyası indirildi!");
    } catch (error) {
        message.error("Export işlemi başarısız!");
        console.error(error);
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
    { title: 'Oluşturan', dataIndex: 'created_by', key: 'created_by' }, // Backend populate yapıyorsa user objesi gelebilir
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
            <Button type="primary" icon={<FileExcelOutlined />} style={{ backgroundColor: '#217346' }} onClick={handleExport}>
                Excel'e Aktar
            </Button>
        </div>
        <Table dataSource={categories} columns={columns} loading={loading} rowKey="_id" />
    </div>
  );
};

export default Categories;