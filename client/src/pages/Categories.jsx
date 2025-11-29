/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Button, Table, message, Space, Popconfirm, Tag, Upload, Modal, Form, Input, Select, Result } from "antd"; // Result eklendi
import { DeleteOutlined, FileExcelOutlined, UploadOutlined, PlusOutlined, EditOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // --- YENİ EKLENEN STATE: YETKİ KONTROLÜ ---
  const [isAllowed, setIsAllowed] = useState(true); 

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();
  
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
        setIsAllowed(true); // Başarılıysa izin var demektir
    } catch (error) {
        // --- BURASI DEĞİŞTİ ---
        // Eğer 401 (Yetkisiz) hatası alırsak Login'e atmıyoruz, sadece izni kapatıyoruz.
        if (error.response?.status === 401) {
            setIsAllowed(false);
        } else {
            message.error("Veriler alınamadı.");
        }
    } finally {
        setLoading(false);
    }
  };

  // --- EĞER YETKİ YOKSA BU EKRANI GÖSTER ---
  if (!isAllowed) {
      return (
          <Result
              status="403"
              title="403"
              subTitle="Üzgünüz, bu sayfayı görüntüleme yetkiniz yok."
              extra={<Button type="primary" onClick={() => navigate("/dashboard")}>Ana Sayfaya Dön</Button>}
          />
      );
  }

  // ... (Geri kalan fonksiyonlar: handleFinish, handleEdit, handleExport vb. AYNI KALACAK) ...
  const handleFinish = async (values) => {
    try {
        const token = localStorage.getItem("token");
        if (editingItem) {
            await axios.post("http://localhost:3000/api/categories/update", { ...values, _id: editingItem._id }, {
                headers: { Authorization: "Bearer " + token },
            });
            message.success("Kategori güncellendi!");
        } else {
            await axios.post("http://localhost:3000/api/categories/add", values, {
                headers: { Authorization: "Bearer " + token },
            });
            message.success("Kategori eklendi!");
        }
        setIsModalOpen(false);
        form.resetFields();
        setEditingItem(null);
        getCategories();
    } catch (error) {
        message.error("İşlem başarısız!");
    }
  };

  const handleEdit = (record) => {
      setEditingItem(record);
      form.setFieldsValue({ name: record.name, is_active: record.is_active });
      setIsModalOpen(true);
  }

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
        message.error("Export yetkiniz yok!");
    }
  };

  const handleImport = async (file) => {
      try {
        const token = localStorage.getItem("token");
        const formData = new FormData();
        formData.append("pb_file", file);
        await axios.post("http://localhost:3000/api/categories/import", formData, {
            headers: { Authorization: "Bearer " + token, "Content-Type": "multipart/form-data" },
        });
        message.success("Yüklendi!");
        getCategories(); 
        return false; 
      } catch (error) {
          message.error("Import yetkiniz yok!");
      }
  };

  const handleDelete = async (id) => {
      try {
        const token = localStorage.getItem("token");
        await axios.post("http://localhost:3000/api/categories/delete", { _id: id }, {
          headers: { Authorization: "Bearer " + token },
        });
        message.success("Silindi.");
        getCategories();
      } catch (error) {
        message.error("Silme yetkiniz yok!");
      }
  }

  const columns = [
    { title: 'Kategori Adı', dataIndex: 'name', key: 'name' },
    { title: 'Durum', dataIndex: 'is_active', key: 'is_active', render: (active) => <Tag color={active ? "green" : "red"}>{active ? "Aktif" : "Pasif"}</Tag> },
    { title: 'Oluşturan', dataIndex: 'created_by', key: 'created_by' },
    {
        title: 'İşlemler',
        key: 'action',
        render: (_, record) => (
          <Space size="middle">
            <Button type="primary" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
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
                <Button type="primary" icon={<PlusOutlined />} onClick={() => {
                    setEditingItem(null);
                    form.resetFields();
                    form.setFieldValue("is_active", true); 
                    setIsModalOpen(true);
                }}>Kategori Ekle</Button>
                <Upload beforeUpload={handleImport} showUploadList={false} accept=".xlsx, .xls">
                    <Button type="primary" icon={<UploadOutlined />} style={{ backgroundColor: '#fa8c16' }}>Excel Yükle</Button>
                </Upload>
                <Button type="primary" icon={<FileExcelOutlined />} style={{ backgroundColor: '#217346' }} onClick={handleExport}>Excel İndir</Button>
            </Space>
        </div>
        <Table dataSource={categories} columns={columns} loading={loading} rowKey="_id" />
        <Modal
            title={editingItem ? "Kategoriyi Düzenle" : "Yeni Kategori Ekle"}
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            footer={null}
        >
            <Form form={form} layout="vertical" onFinish={handleFinish}>
                <Form.Item name="name" label="Kategori Adı" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="is_active" label="Durum" rules={[{ required: true }]}>
                    <Select>
                        <Select.Option value={true}>Aktif</Select.Option>
                        <Select.Option value={false}>Pasif</Select.Option>
                    </Select>
                </Form.Item>
                <Button type="primary" htmlType="submit" block>{editingItem ? "Güncelle" : "Kaydet"}</Button>
            </Form>
        </Modal>
    </div>
  );
};

export default Categories;