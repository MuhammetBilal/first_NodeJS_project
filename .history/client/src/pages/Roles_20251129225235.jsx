import { useEffect, useState } from "react";
import { Button, Table, message, Space, Popconfirm, Tag, Modal, Form, Input, Select } from "antd";
import { DeleteOutlined, PlusOutlined, EditOutlined, SafetyCertificateOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();
  
  const navigate = useNavigate();

  useEffect(() => {
    getRoles();
  }, []);

  const getRoles = async () => {
    setLoading(true);
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3000/api/roles", {
            headers: { Authorization: "Bearer " + token },
        });
        setRoles(response.data.data);
    } catch (error) {
        if (error.response?.status === 401) navigate("/");
    } finally {
        setLoading(false);
    }
  };

  const handleFinish = async (values) => {
    try {
        const token = localStorage.getItem("token");
        
        if (editingItem) {
            await axios.post("http://localhost:3000/api/roles/update", { 
                ...values, 
                _id: editingItem._id 
            }, {
                headers: { Authorization: "Bearer " + token },
            });
            message.success("Rol güncellendi!");
        } else {
            await axios.post("http://localhost:3000/api/roles/add", values, {
                headers: { Authorization: "Bearer " + token },
            });
            message.success("Rol eklendi!");
        }

        setIsModalOpen(false);
        form.resetFields();
        setEditingItem(null);
        getRoles();

    } catch (error) {
        message.error("İşlem başarısız: " + (error.response?.data?.error?.message || "Hata"));
    }
  };

  const handleDelete = async (id) => {
      try {
        const token = localStorage.getItem("token");
        await axios.post("http://localhost:3000/api/roles/delete", { _id: id }, {
          headers: { Authorization: "Bearer " + token },
        });
        message.success("Rol silindi.");
        getRoles();
      } catch (error) {
        message.error("Silme başarısız!");
      }
  }

  const handleEdit = (record) => {
    setEditingItem(record);
    form.setFieldsValue({
        role_name: record.role_name,
        is_active: record.is_active
    });
    setIsModalOpen(true);
  }

  const columns = [
    { title: 'Rol Adı', dataIndex: 'role_name', key: 'role_name', render: (text) => <b>{text}</b> },
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
            <h2>Roller (Yetki Grupları)</h2>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => {
                setEditingItem(null);
                form.resetFields();
                form.setFieldValue("is_active", true);
                setIsModalOpen(true);
            }}>
                Rol Ekle
            </Button>
        </div>

        <Table dataSource={roles} columns={columns} loading={loading} rowKey="_id" />

        <Modal
            title={editingItem ? "Rolü Düzenle" : "Yeni Rol Ekle"}
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            footer={null}
        >
            <Form form={form} layout="vertical" onFinish={handleFinish}>
                <Form.Item name="role_name" label="Rol Adı" rules={[{ required: true, message: 'Rol adı giriniz' }]}>
                    <Input placeholder="Örn: Editör" />
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

export default Roles;