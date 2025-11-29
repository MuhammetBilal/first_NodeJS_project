import { useEffect, useState } from "react";
import { Button, Card, Table, message, Tag, Space, Modal, Form, Input, Popconfirm } from "antd";
import { DeleteOutlined, PlusOutlined, EditOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]); 
  const [loading, setLoading] = useState(false);
  
  // Modal (Pencere) görünür mü?
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm(); // Formu resetlemek için

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    getUsers();
  }, []);

  // --- KULLANICILARI GETİR ---
  const getUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3000/api/users", {
        headers: { Authorization: "Bearer " + token },
      });
      setUsers(response.data.data);
    } catch (error) {
      message.error("Kullanıcılar getirilemedi!");
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/");
      }
    } finally {
      setLoading(false);
    }
  };

  // --- KULLANICI EKLE ---
  const handleAddUser = async (values) => {
    try {
      const token = localStorage.getItem("token");
      
      // Backend roles'u dizi ([]) olarak istiyor, biz şimdilik tek bir ID alıp diziye çeviriyoruz
      const payload = {
        ...values,
        roles: [values.role_id] // Formdan gelen ID'yi dizi içine koyduk
      };

      await axios.post("http://localhost:3000/api/users/add", payload, {
        headers: { Authorization: "Bearer " + token },
      });

      message.success("Kullanıcı başarıyla eklendi!");
      setIsModalOpen(false); // Pencereyi kapat
      form.resetFields(); // Formu temizle
      getUsers(); // Listeyi yenile ki yeni gelen görünsün

    } catch (error) {
      message.error("Ekleme başarısız: " + (error.response?.data?.error?.message || "Hata"));
    }
  };

  // --- KULLANICI SİL ---
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:3000/api/users/delete", { _id: id }, {
        headers: { Authorization: "Bearer " + token },
      });
      message.success("Kullanıcı silindi.");
      getUsers(); // Listeyi yenile
    } catch (error) {
      message.error("Silme başarısız!");
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  // Tablo Sütunları
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
          {/* Silme Butonu (Onay sorar) */}
          <Popconfirm
            title="Kullanıcıyı silmek istediğine emin misin?"
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
      <Card 
        title={`Panel: ${currentUser.first_name || 'Admin'} 👋`} 
        extra={<Button onClick={handleLogout}>Çıkış</Button>}
      >
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
            <h2>Kullanıcılar</h2>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
                Kullanıcı Ekle
            </Button>
        </div>

        <Table dataSource={users} columns={columns} loading={loading} rowKey="_id" />

        {/* --- EKLEME PENCERESİ (MODAL) --- */}
        <Modal 
            title="Yeni Kullanıcı Ekle" 
            open={isModalOpen} 
            onCancel={() => setIsModalOpen(false)}
            footer={null} // Kendi butonumuzu form içinde kullanacağız
        >
            <Form form={form} layout="vertical" onFinish={handleAddUser}>
                <Form.Item name="email" label="Email" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="password" label="Şifre" rules={[{ required: true }]}>
                    <Input.Password />
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
                
                {/* Geçici Rol Alanı: Buraya Postman'den bildiğin bir Role ID yapıştıracaksın */}
                <Form.Item name="role_id" label="Rol ID (MongoDB ID)" rules={[{ required: true, message: "Bir rol ID'si girilmelidir" }]}>
                    <Input placeholder="Örn: 6745f..." />
                </Form.Item>

                <Button type="primary" htmlType="submit" block>Kaydet</Button>
            </Form>
        </Modal>

      </Card>
    </div>
  );
};

export default Dashboard;