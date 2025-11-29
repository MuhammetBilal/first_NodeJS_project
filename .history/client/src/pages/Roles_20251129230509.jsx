import { useEffect, useState } from "react";
import { Button, Table, message, Space, Popconfirm, Tag, Modal, Form, Input, Select, Checkbox, Tabs, Card } from "antd";
import { DeleteOutlined, PlusOutlined, EditOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [permissionGroups, setPermissionGroups] = useState([]); // Sistemdeki tüm yetkiler
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    getRoles();
    getPermissions(); // Sayfa açılınca yetki listesini de çek
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

  const getPermissions = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3000/api/roles/permissions", {
            headers: { Authorization: "Bearer " + token },
        });
        // Gelen veriyi gruplara ve yetkilere ayıralım
        const data = response.data.data;
        // Grupları ve içindeki yetkileri eşleştiriyoruz
        const groups = data.privGroups.map(group => {
            return {
                ...group,
                permissions: data.privileges.filter(p => p.group === group.id)
            }
        });
        setPermissionGroups(groups);
      } catch (error) {
          console.error("Yetkiler alınamadı", error);
      }
  }

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

  const handleEdit = (record) => {
    setEditingItem(record);
    form.setFieldsValue({
        role_name: record.role_name,
        is_active: record.is_active,
        permissions: record.permissions // Backend'den gelen yetki dizisi
    });
    setIsModalOpen(true);
  }

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

  const columns = [
    { title: 'Rol Adı', dataIndex: 'role_name', key: 'role_name', render: (text) => <b>{text}</b> },
    { title: 'Durum', dataIndex: 'is_active', key: 'is_active', render: (active) => <Tag color={active ? "green" : "red"}>{active ? "Aktif" : "Pasif"}</Tag> },
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
    <div style={{ padding: 20 }}>
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
            width={800} // Geniş pencere
            footer={null}
        >
            <Form form={form} layout="vertical" onFinish={handleFinish}>
                <Form.Item name="role_name" label="Rol Adı" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                <Form.Item name="is_active" label="Durum" rules={[{ required: true }]}>
                    <Select>
                        <Select.Option value={true}>Aktif</Select.Option>
                        <Select.Option value={false}>Pasif</Select.Option>
                    </Select>
                </Form.Item>

                {/* --- YETKİ SEÇİM ALANI --- */}
                <Form.Item name="permissions" label="Yetkiler">
                    <Checkbox.Group style={{ width: '100%' }}>
                        <Tabs defaultActiveKey="USERS" 
                            items={permissionGroups.map(group => ({
                                key: group.id,
                                label: group.name,
                                children: (
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                        {group.permissions.map(perm => (
                                            <Checkbox key={perm.key} value={perm.key}>
                                                {perm.name}
                                            </Checkbox>
                                        ))}
                                    </div>
                                )
                            }))} 
                        />
                    </Checkbox.Group>
                </Form.Item>

                <Button type="primary" htmlType="submit" block size="large">
                    {editingItem ? "Güncelle" : "Kaydet"}
                </Button>
            </Form>
        </Modal>
    </div>
  );
};

export default Roles;