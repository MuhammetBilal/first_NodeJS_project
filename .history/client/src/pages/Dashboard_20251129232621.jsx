import { useEffect, useState } from "react";
import { Button, Card, Table, message, Tag, Space, Modal, Form, Input, Popconfirm, Select, Row, Col, Statistic } from "antd";
import { DeleteOutlined, PlusOutlined, EditOutlined, UserOutlined, AppstoreOutlined, FileTextOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]); 
  const [roles, setRoles] = useState([]); 
  const [loading, setLoading] = useState(false);
  
  // --- İSTATİSTİK STATE'LERİ ---
  const [stats, setStats] = useState({
      userCount: 0,
      categoryCount: 0,
      auditLogCount: 0 // Bunu backendde yapmadıysak 0 kalabilir veya ekleyebilirsin
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm(); 

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    getUsers();
    getRoles(); 
    getStats(); // İstatistikleri de çek
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
      if (error.response?.status === 401 && error.response?.data?.error?.message === "Invalid Token") {
        localStorage.removeItem("token");
        navigate("/");
      } else {
        message.error("Verileri görme yetkiniz yok."); // Sadece uyarı göster
      }
    } finally {
      setLoading(false);
    }
  };

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

  // --- İSTATİSTİKLERİ ÇEKEN FONKSİYON ---
  const getStats = async () => {
      try {
        const token = localStorage.getItem("token");
        
        // Kullanıcı Sayısı (Backend'de /api/stats/users/count rotası varsa)
        const userStats = await axios.post("http://localhost:3000/api/stats/users/count", {}, {
            headers: { Authorization: "Bearer " + token },
        });

        // Kategori Sayısı (Backend'de /api/stats/categories/unique rotası varsa)
        const categoryStats = await axios.post("http://localhost:3000/api/stats/categories/unique", {}, {
            headers: { Authorization: "Bearer " + token },
        });

        setStats({
            userCount: userStats.data.data, // Backend sadece sayı dönüyorsa
            categoryCount: categoryStats.data.data.count, // Backend {result:[], count: 5} dönüyorsa
            auditLogCount: 0 // Log sayısı için backend'de rota yapmadık, şimdilik 0
        });

      } catch (error) {
          console.error("İstatistik hatası", error);
      }
  }

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
      getStats(); // Ekleme yapınca sayıyı güncelle

    } catch (error) {
      message.error("İşlem başarısız: " + (error.response?.data?.error?.message || "Hata"));
    }
  };

  const handleEdit = (record) => {
    setEditingItem(record);
    const currentRoleId = record.roles && record.roles.length > 0 ? record.roles[0] : null;

    form.setFieldsValue({
        first_name: record.first_name,
        last_name: record.last_name,
        email: record.email,
        phone_number: record.phone_number,
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
      getStats(); // Silince sayıyı güncelle
    } catch (error) {
      message.error("Silme başarısız!");
    }
  }

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
    <div style={{ padding: "20px" }}>
      
      {/* --- İSTATİSTİK KARTLARI --- */}
      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col span={8}>
          <Card>
            <Statistic title="Toplam Kullanıcı" value={stats.userCount} prefix={<UserOutlined />} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Toplam Kategori" value={stats.categoryCount} prefix={<AppstoreOutlined />} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Aktif Modüller" value={4} prefix={<FileTextOutlined />} />
          </Card>
        </Col>
      </Row>

      <Card title={`Panel: ${currentUser.first_name || 'Admin'} 👋`}>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
            <h2>Kullanıcı Listesi</h2>
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