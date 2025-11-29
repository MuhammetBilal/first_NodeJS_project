import { Layout, Menu, Button, theme, Dropdown, Avatar, Space } from 'antd';
import { UserOutlined, AppstoreOutlined, LogoutOutlined, SafetyCertificateOutlined, UnorderedListOutlined, DownOutlined } from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

const AppLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const items = [
    { key: '/dashboard', icon: <UserOutlined />, label: 'Kullanıcılar', onClick: () => navigate('/dashboard') },
    { key: '/roles', icon: <SafetyCertificateOutlined />, label: 'Roller', onClick: () => navigate('/roles') },
    { key: '/categories', icon: <AppstoreOutlined />, label: 'Kategoriler', onClick: () => navigate('/categories') },
    { key: '/auditlogs', icon: <UnorderedListOutlined />, label: 'Log Kayıtları', onClick: () => navigate('/auditlogs') },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  // Avatar Menüsü
  const userMenu = {
    items: [
        { key: '1', label: (<div>Merhaba, <b>{user.first_name}</b></div>) },
        { type: 'divider' },
        { key: '2', label: 'Çıkış Yap', icon: <LogoutOutlined />, onClick: handleLogout, danger: true }
    ]
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible breakpoint="lg">
        <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)', borderRadius: 6, display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:'bold' }}>
            ADMIN PANEL
        </div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={[location.pathname]} items={items} />
      </Sider>
      <Layout>
        <Header style={{ padding: '0 20px', background: colorBgContainer, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            {/* AVATAR ALANI */}
            <Dropdown menu={userMenu} trigger={['click']}>
                <Space style={{ cursor: 'pointer' }}>
                    <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
                    {user.first_name} {user.last_name}
                    <DownOutlined />
                </Space>
            </Dropdown>
        </Header>
        <Content style={{ margin: '24px 16px', padding: 24, minHeight: 280, background: colorBgContainer, borderRadius: borderRadiusLG, overflow: 'auto' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;