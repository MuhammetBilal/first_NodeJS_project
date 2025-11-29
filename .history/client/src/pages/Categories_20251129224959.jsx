import { useEffect, useState } from "react";
import { Button, Table, message, Space, Popconfirm, Tag, Upload, Modal, Form, Input, Select } from "antd";
import { DeleteOutlined, FileExcelOutlined, UploadOutlined, PlusOutlined, EditOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // --- EKLENEN KISIMLAR (Modal ve Düzenleme State'leri) ---
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
    } catch (error) {
        if (error.response?.status === 401) navigate("/");
    } finally {
        setLoading(false);
    }
  };

  // --- EKLEME VE GÜNCELLEME İŞLEMİ ---
  const handleFinish = async (values) => {
    try {
        const token = localStorage.getItem("token");
        
        if (editingItem) {
            // GÜNCELLEME (Update)
            await axios.post("http://localhost:3000/api/categories/update", { 
                ...values, 
                _id: editingItem._id 
            }, {
                headers: { Authorization: "Bearer " + token },
            });
            message.success("Kategori güncellendi!");
        } else {
            // EKLEME (Add)
            await axios.post("http://localhost:3000/api/categories/add", values, {
                headers: { Authorization: "Bearer " + token },
            });
            message.success("Kategori eklendi!");
        }

        setIsModalOpen(false);
        form.resetFields();
        setEditingItem(null);
        getCategories(); // Listeyi yenile

    } catch (error) {
        message.error("İşlem başarısız: " + (error.response?.data?.error?.message || "Hata"));
    }
  };

  const handleEdit = (record) => {
      setEditingItem(record);
      form.setFieldsValue({
          name: record.name,
          is_active: record.is_active // Backend true/false döndürüyor
      });
      setIsModalOpen(true);
  }

  // --- EXPORT, IMPORT, DELETE (Eskisi gibi) ---
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

  const handleImport = async (file) => {
      try {
        const token = localStorage.getItem("token");
        const formData = new FormData();
        formData.append("pb_file", file);

        await axios.post("http://localhost:3000/api/categories/import", formData, {
            headers: { 
                Authorization: "Bearer " + token,
                "Content-Type": "multipart/form-data" 
            },
        });
        message.success("Kategoriler başarıyla yüklendi!");
        getCategories(); 
        return false; 
      } catch (error) {
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
            {/* DÜZENLE BUTONU */}
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
                {/* YENİ EKLE BUTONU */}
                <Button type="primary" icon={<PlusOutlined />} onClick={() => {
                    setEditingItem(null);
                    form.resetFields();
                    // Varsayılan olarak Aktif seçili gelsin
                    form.setFieldValue("is_active", true); 
                    setIsModalOpen(true);
                }}>
                    Kategori Ekle
                </Button>

                <Upload beforeUpload={handleImport} showUploadList={false} accept=".xlsx, .xls">
                    <Button type="primary" icon={<UploadOutlined />} style={{ backgroundColor: '#fa8c16' }}>
                        Excel Yükle
                    </Button>
                </Upload>

                <Button type="primary" icon={<FileExcelOutlined />} style={{ backgroundColor: '#217346' }} onClick={handleExport}>
                    Excel İndir
                </Button>
            </Space>
        </div>

        <Table dataSource={categories} columns={columns} loading={loading} rowKey="_id" />

        {/* --- MODAL (FORM) --- */}
        <Modal
            title={editingItem ? "Kategoriyi Düzenle" : "Yeni Kategori Ekle"}
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            footer={null}
        >
            <Form form={form} layout="vertical" onFinish={handleFinish}>
                <Form.Item name="name" label="Kategori Adı" rules={[{ required: true, message: 'Kategori adı giriniz' }]}>
                    <Input />
                </Form.Item>

                <Form.Item name="is_active" label="Durum" rules={[{ required: true }]}>
                    <Select>
                        <Select.Option value={true}>Aktif</Select.Option>
                        <Select.Option value={false}>Pasif</Select.Option>
                    </Select>
                </Form.Item>

                <Button type="primary" htmlType="submit" block>
                    {editingItem ? "Güncelle" : "Kaydet"}
                </Button>
            </Form>
        </Modal>
    </div>
  );
};

export default Categories;