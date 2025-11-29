import { useEffect, useState } from "react";
import { Button, Card, Table, message, Tag, Space, Modal, Form, Input, Popconfirm, Select } from "antd";
import { DeleteOutlined, PlusOutlined, EditOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]); 
  const [roles, setRoles] = useState([]); // Rolleri tutacak kutu
  const [loading, setLoading] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm(); 

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    getUsers();
    getRoles(); // Sayfa açılınca Rolleri de getir
  }, []);

  const getUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3000/api/users", {
        headers: { Authorization: "Bearer " + token },
      });
      setUsers(response.data.data);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/");
      }
    } finally {
      setLoading(false);
    }
  };

  // --- ROLLERİ GETİR ---
  const getRoles = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3000/api/roles", {
        headers: { Authorization: "Bearer " + token },
      });
      setRoles(response.data.data);
    } catch (error) {
      console.error("Roller çekilemedi:", error);
    }
  };

  const handleFinish = async (values) => {
    try {
      const token = localStorage.getItem("token");
      
      if (editingItem) {
        await axios.post("http://localhost:3000/api/users/update", {
             ...values, 
             _id: editingItem._id, 
             roles: [values.role_id]
        }, {
          headers: { Authorization: "Bearer " + token },
        });
        message.success("Kullanıcı güncellendi!");
      } else {
        await axios.post("http://localhost:3000/api/users/add", {
            ...values,
            roles: [values.role_id]
        }, {
          headers: { Authorization: "Bearer " + token },
        });
        message.success("Kullanıcı eklendi!");
      }

      setIsModalOpen(false);
      form.resetFields();
      setEditingItem(null);
      getUsers();

    } catch (error) {
      message.error("İşlem başarısız: " + (error.response?.data?.error?.message || "Hata"));
    }
  };

  const handleEdit = (record) => {
    setEditingItem(record);
    // Kullanıcının mevcut rolünü bulup forma yazalım (Genelde ilk rolü alırız)
    // record.roles içinde sadece ID varsa direkt, yoksa map gerekebilir. 
    // Backend yapına göre burası değişebilir ama şimdilik ID varsayıyoruz.
    const currentRoleId = record.roles && record.roles.length > 0 ? record.roles[0] : null;

    form.setFieldsValue({
        first_name: record.first_name,
        last_name: record.last_name,
        email: record.email,
        phone_number: record.phone_number,
        // Eğer backend users listesinde rolleri populate etmediyse (sadece ID geliyorsa) bu çalışır.
        // Populate ettiyse (obje geliyorsa) record.roles[0]._id dememiz gerekir.
        role_id: currentRoleId 
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:3000/api/users/delete", { _id: id }, {
        headers: { Authorization: "Bearer " + token },
      });
      message.success("Kullanıcı silindi.");
      getUsers();
    } catch (error) {
      message.error("Silme başarısız!");
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const columns = [
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Ad', dataIndex: 'first_name', key: 'first_name' },
    { title: 'Soyad', dataIndex: 'last_name', key: 'last_name' },
    { 
      title: 'Durum', dataIndex: 'is_active', key: 'is_active', 
      render: (active) => <Tag color={active ? "green" : "red"}>{active ? "Aktif" : "Pasif"}</Tag> 
    },
    {
      title: 'İşlemler',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm
            title="Silmek istediğine emin misin?"
            onConfirm={() => handleDelete(record._id)}
            okText="Evet"
            cancelText="Hayır"
          >
            <Button type="primary" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "50px" }}>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
            <h2>Kullanıcılar</h2>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => {
                setEditingItem(null); 
                form.resetFields();
                setIsModalOpen(true);
            }}>
                Kullanıcı Ekle
            </Button>
        </div>

        <Table dataSource={users} columns={columns} loading={loading} rowKey="_id" />

        <Modal 
            title={editingItem ? "Kullanıcıyı Düzenle" : "Yeni Kullanıcı Ekle"} 
            open={isModalOpen} 
            onCancel={() => setIsModalOpen(false)}
            footer={null}
        >
            <Form form={form} layout="vertical" onFinish={handleFinish}>
                <Form.Item name="email" label="Email" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="password" label="Şifre" rules={[{ required: !editingItem }]}>
                    <Input.Password placeholder={editingItem ? "Boş bırakırsanız değişmez" : ""} />
                </Form.Item>
                <Form.Item name="first_name" label="Ad">
                    <Input />
                </Form.Item>
                <Form.Item name="last_name" label="Soyad">
                    <Input />
                </Form.Item>
                <Form.Item name="phone_number" label="Telefon">
                    <Input />
                </Form.Item>
                
                {/* --- BURASI DEĞİŞTİ: INPUT YERİNE SELECT --- */}
                <Form.Item name="role_id" label="Rol Seçin" rules={[{ required: true, message: 'Lütfen bir rol seçin' }]}>
                    <Select placeholder="Rol seçiniz">
                        {roles.map(role => (
                            <Select.Option key={role._id} value={role._id}>
                                {role.role_name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Button type="primary" htmlType="submit" block>
                    {editingItem ? "Güncelle" : "Kaydet"}
                </Button>
            </Form>
        </Modal>

      </Card>
    </div>
  );
};

export default Dashboard;