import { useEffect, useState } from "react";
import { Table, message, Tag, Modal, Button, Card, Result } from "antd"; // Result eklendi
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  
  // --- YETKİ KONTROLÜ İÇİN YENİ STATE ---
  const [isAllowed, setIsAllowed] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    getLogs();
  }, []);

  const getLogs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("http://localhost:3000/api/auditlogs", {}, {
        headers: { Authorization: "Bearer " + token },
      });
      setLogs(response.data.data);
      setIsAllowed(true); // Başarılıysa izin var
    } catch (error) {
      // --- BURASI DEĞİŞTİ ---
      if (error.response?.status === 401) {
        setIsAllowed(false); // Yetki yok, ekranı değiştir
      } else {
        message.error("Loglar alınamadı!");
      }
    } finally {
      setLoading(false);
    }
  };

  const showDetail = (log) => {
    setSelectedLog(log);
    setIsModalOpen(true);
  }

  const columns = [
    { 
        title: 'Seviye', dataIndex: 'level', key: 'level',
        render: (text) => {
            let color = text === 'Error' ? 'red' : text === 'Warning' ? 'orange' : 'blue';
            return <Tag color={color}>{text?.toUpperCase()}</Tag>
        }
    },
    { title: 'Kullanıcı (Email)', dataIndex: 'email', key: 'email' },
    { title: 'Bölüm', dataIndex: 'location', key: 'location' },
    { title: 'İşlem', dataIndex: 'proc_type', key: 'proc_type' },
    { 
        title: 'Tarih', dataIndex: 'created_at', key: 'created_at',
        render: (text) => new Date(text).toLocaleString('tr-TR') 
    },
    {
        title: 'Detay',
        key: 'action',
        render: (_, record) => (
            <Button size="small" onClick={() => showDetail(record)}>Görüntüle</Button>
        )
    }
  ];

  // --- YETKİ YOKSA BU EKRANI GÖSTER ---
  if (!isAllowed) {
    return (
        <Result
            status="403"
            title="403"
            subTitle="Üzgünüz, bu sayfayı görüntüleme yetkiniz yok."
            extra={<Button type="primary" onClick={() => navigate("/dashboard")}>Ana Sayfaya Dön</Button>}
        />
    );
  }

  return (
    <div style={{ padding: "20px" }}>
        <Card title="Sistem Logları (İşlem Geçmişi)">
            <Table 
                dataSource={logs} 
                columns={columns} 
                loading={loading} 
                rowKey="_id" 
                pagination={{ pageSize: 10 }}
            />
        </Card>

        <Modal 
            title="Log Detayı" 
            open={isModalOpen} 
            onCancel={() => setIsModalOpen(false)}
            footer={null}
            width={600}
        >
            <pre style={{ backgroundColor: '#f4f4f4', padding: '10px', borderRadius: '5px', overflow: 'auto' }}>
                {selectedLog && JSON.stringify(selectedLog.log, null, 2)}
            </pre>
        </Modal>
    </div>
  );
};

export default AuditLogs;