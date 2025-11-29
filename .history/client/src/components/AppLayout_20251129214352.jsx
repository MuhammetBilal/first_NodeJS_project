import { Layout, Menu, Button, theme } from 'antd';
import { UserOutlined, AppstoreOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

const AppLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // Menüdeki butonlar
  const items = [
    {
      key: '/dashboard',
      icon: <UserOutlined />,
      label: 'Kullanıcılar',
      onClick: () => navigate('/dashboard'),
    },
    {
      key: '/categories',
      icon: <AppstoreOutlined />,
      label: 'Kategoriler',
      onClick: () => navigate('/categories'),
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible breakpoint="lg">
        <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)', borderRadius: 6 }} />
        <Menu 
            theme="dark" 
            mode="inline" 
            defaultSelectedKeys={[location.pathname]} 
            items={items} 
        />
      </Sider>
      <Layout>
        <Header style={{ padding: '0 16px', background: colorBgContainer, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            <Button type="primary" danger icon={<LogoutOutlined />} onClick={handleLogout}>
                Çıkış Yap
            </Button>
        </Header>
        <Content style={{ margin: '24px 16px', padding: 24, minHeight: 280, background: colorBgContainer, borderRadius: borderRadiusLG }}>
          {/* Outlet: Hangi sayfadaysak onun içeriği buraya gelecek */}
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;