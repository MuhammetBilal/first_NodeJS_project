import { useEffect, useState } from "react";
import { Button, Card, Table, message, Tag, Space, Modal, Form, Input, Popconfirm, Select, Row, Col, Statistic } from "antd";
import { DeleteOutlined, PlusOutlined, EditOutlined, UserOutlined, AppstoreOutlined, FileTextOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]); 
  const [roles, setRoles] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ userCount: 0, categoryCount: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm(); 

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  // --- GRAFİK İÇİN ÖRNEK VERİLER ---
  const dataBar = [
    { name: 'Ocak', users: 4 },
    { name: 'Şubat', users: 3 },
    { name: 'Mart', users: 2 },
    { name: 'Nisan', users: 7 },
    { name: 'Mayıs', users: 5 },
  ];

  const dataPie = [
    { name: 'Aktif Kullanıcı', value: 400 },
    { name: 'Pasif Kullanıcı', value: 100 },
  ];
  const COLORS = ['#0088FE', '#FF8042'];

  useEffect(() => {
    getUsers();
    getRoles(); 
    getStats();
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

  const getStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const userStats = await axios.post("http://localhost:3000/api/stats/users/count", {}, {
            headers: { Authorization: "Bearer " + token },
        });
        const categoryStats = await axios.post("http://localhost:3000/api/stats/categories/unique", {}, {
            headers: { Authorization: "Bearer " + token },
        });
        setStats({
            userCount: userStats.data.data,
            categoryCount: categoryStats.data.data.count,
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
             ...values, _id: editingItem._id, roles: [values.role_id]
        }, { headers: { Authorization: "Bearer " + token } });
        message.success("Kullanıcı güncellendi!");
      } else {
        await axios.post("http://localhost:3000/api/users/add", {
            ...values, roles: [values.role_id]
        }, { headers: { Authorization: "Bearer " + token } });
        message.success("Kullanıcı eklendi!");
      }
      setIsModalOpen(false);
      form.resetFields();
      setEditingItem(null);
      getUsers();
      getStats();
    } catch (error) {
      message.error("İşlem başarısız!");
    }
  };

  const handleEdit = (record) => {
    setEditingItem(record);
    const currentRoleId = record.roles && record.roles.length > 0 ? record.roles[0] : null;
    form.setFieldsValue({
        first_name: record.first_name, last_name: record.last_name,
        email: record.email, phone_number: record.phone_number, role_id: currentRoleId 
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
      getStats();
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
          <Popconfirm title="Silmek istediğine emin misin?" onConfirm={() => handleDelete(record._id)}>
            <Button type="primary" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* --- İSTATİSTİK KARTLARI --- */}
      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col span={8}><Card><Statistic title="Toplam Kullanıcı" value={stats.userCount} prefix={<UserOutlined />} /></Card></Col>
        <Col span={8}><Card><Statistic title="Toplam Kategori" value={stats.categoryCount} prefix={<AppstoreOutlined />} /></Card></Col>
        <Col span={8}><Card><Statistic title="Aktif Modüller" value={4} prefix={<FileTextOutlined />} /></Card></Col>
      </Row>

      {/* --- GRAFİKLER BÖLÜMÜ --- */}
      <Row gutter={16} style={{ marginBottom: 20 }}>
          <Col span={12}>
              <Card title="Kullanıcı Kayıt Grafiği">
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={dataBar}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="users" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
              </Card>
          </Col>
          <Col span={12}>
              <Card title="Kullanıcı Durum Dağılımı">
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie data={dataPie} cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5} dataKey="value">
                            {dataPie.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
              </Card>
          </Col>
      </Row>

      {/* --- TABLO --- */}
      <Card title="Son Kayıtlar">
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => {
                setEditingItem(null); 
                form.resetFields();
                setIsModalOpen(true);
            }}>Kullanıcı Ekle</Button>
        </div>
        <Table dataSource={users} columns={columns} loading={loading} rowKey="_id" pagination={{ pageSize: 5 }} />
      </Card>

      <Modal 
          title={editingItem ? "Kullanıcıyı Düzenle" : "Yeni Kullanıcı Ekle"} 
          open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null}
      >
          <Form form={form} layout="vertical" onFinish={handleFinish}>
              <Form.Item name="email" label="Email" rules={[{ required: true }]}><Input /></Form.Item>
              <Form.Item name="password" label="Şifre" rules={[{ required: !editingItem }]}><Input.Password /></Form.Item>
              <Form.Item name="first_name" label="Ad"><Input /></Form.Item>
              <Form.Item name="last_name" label="Soyad"><Input /></Form.Item>
              <Form.Item name="phone_number" label="Telefon"><Input /></Form.Item>
              <Form.Item name="role_id" label="Rol Seçin" rules={[{ required: true }]}><Select placeholder="Rol seçiniz">{roles.map(role => (<Select.Option key={role._id} value={role._id}>{role.role_name}</Select.Option>))}</Select></Form.Item>
              <Button type="primary" htmlType="submit" block>{editingItem ? "Güncelle" : "Kaydet"}</Button>
          </Form>
      </Modal>
    </div>
  );
};

export default Dashboard;