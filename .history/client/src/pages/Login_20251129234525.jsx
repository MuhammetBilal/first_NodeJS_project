import { Form, Input, Button, Card, message } from "antd"; // Tasarım parçaları
import { UserOutlined, LockOutlined } from "@ant-design/icons"; // İkonlar
import axios from "axios"; // İstek atmak için
import { useNavigate } from "react-router-dom"; // Sayfa değiştirmek için

const Login = () => {
  const navigate = useNavigate();

  // Form gönderilince çalışacak fonksiyon
  const onFinish = async (values) => {
    try {
      // 1. Backend'e istek atıyoruz
      // Not: Backend'inin 3000 portunda çalıştığından emin ol
      const response = await axios.post("http://localhost:3000/api/users/auth", {
        email: values.email,
        password: values.password,
      });

      // 2. Cevap başarılı mı?
      if (response.data.code === 200) {
        // 3. Token'ı tarayıcıya kaydet (Anahtar gibi düşün)
        localStorage.setItem("token", response.data.data.token);
        // Kullanıcı bilgisini de kaydedelim (Opsiyonel, ekranda adını göstermek için)
        localStorage.setItem("user", JSON.stringify(response.data.data.user));

        message.success("Giriş Başarılı! Yönlendiriliyorsunuz...");
        
        // 4. Dashboard sayfasına git
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login Hatası:", error);
      // Backend'den gelen hata mesajını göster
      message.error("Giriş Başarısız: " + (error.response?.data?.error?.message || "Bilinmeyen Hata"));
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#f0f2f5" }}>
      <Card title="Yönetim Paneli Girişi" style={{ width: 400, boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
        
        <Form name="login" onFinish={onFinish} layout="vertical">
          
          <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Lütfen email girin!' }]}>
            <Input prefix={<UserOutlined />} placeholder="Email adresiniz" />
          </Form.Item>

          <Form.Item name="password" label="Şifre" rules={[{ required: true, message: 'Lütfen şifre girin!' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Şifreniz" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={false}>
              Giriş Yap
            </Button>
          </Form.Item>

        </Form>
      </Card>
    </div>
  );
};

export default Login;