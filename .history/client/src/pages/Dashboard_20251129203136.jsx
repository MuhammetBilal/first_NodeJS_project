import { useEffect, useState } from "react";
import { Button, Card, Table, message, Tag } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]); // Kullanıcıları tutacak kutu
  const [loading, setLoading] = useState(false); // Yükleniyor dönen tekerlek için

  // Giriş yapan kullanıcının adını alalım
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  // Sayfa açılınca bu fonksiyon çalışır
  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    setLoading(true);
    try {
      // 1. Token'ı hafızadan alıyoruz
      const token = localStorage.getItem("token");

      // 2. Backend'e istek atıyoruz (Token'ı header'a ekleyerek)
      const response = await axios.get("http://localhost:3000/api/users", {
        headers: {
          Authorization: "Bearer " + token, // İşte anahtar burada!
        },
      });

      // 3. Gelen veriyi kutuya koyuyoruz
      // Backend formatın: { code: 200, data: [ ...kullanıcılar... ] }
      setUsers(response.data.data);
      
    } catch (error) {
      console.error(error);
      message.error("Kullanıcılar getirilemedi!");
      
      // Eğer Token süresi dolduysa (401 hatası), giriş sayfasına at
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  // Tablo Sütun Ayarları (Ant Design)
  const columns = [
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Ad',
      dataIndex: 'first_name',
      key: 'first_name',
    },
    {
      title: 'Soyad',
      dataIndex: 'last_name',
      key: 'last_name',
    },
    {
      title: 'Durum',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (isActive) => (
        <Tag color={isActive ? "green" : "red"}>
          {isActive ? "Aktif" : "Pasif"}
        </Tag>
      )
    },
    {
      title: 'Oluşturulma',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text) => new Date(text).toLocaleDateString() // Tarihi düzelt
    },
  ];

  return (
    <div style={{ padding: "50px" }}>
      <Card 
        title={`Hoşgeldin, ${currentUser.first_name || 'Admin'}! 👋`} 
        extra={<Button type="primary" danger onClick={handleLogout}>Çıkış Yap</Button>}
      >
        <h2>Kullanıcı Listesi</h2>
        <Table 
          dataSource={users} 
          columns={columns} 
          loading={loading}
          rowKey="_id" // Her satırın benzersiz ID'si
        />
      </Card>
    </div>
  );
};

export default Dashboard;