import { Button, Card } from "antd";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  // Kaydettiğimiz kullanıcı bilgisini okuyalım
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    // Çıkış yaparken token'ı siliyoruz
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div style={{ padding: "50px" }}>
      <Card title="Dashboard">
        <h1>Hoşgeldin, {user.first_name} {user.last_name}! 👋</h1>
        <p>Burası yönetim paneli ana sayfası.</p>
        <Button type="primary" danger onClick={handleLogout}>
          Çıkış Yap
        </Button>
      </Card>
    </div>
  );
};

export default Dashboard;