import { useEffect, useState } from "react";
import { Button, Table, message, Space, Popconfirm, Tag, Modal, Form, Input, Select, Checkbox, Tabs, Result } from "antd"; // Result eklendi
import { DeleteOutlined, PlusOutlined, EditOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [permissionGroups, setPermissionGroups] = useState([]); 
  const [loading, setLoading] = useState(false);
  
  // --- YETKİ KONTROLÜ İÇİN YENİ STATE ---
  const [isAllowed, setIsAllowed] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    getRoles();
    getPermissions(); 
  }, []);

  const getRoles = async () => {
    setLoading(true);
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3000/api/roles", {
            headers: { Authorization: "Bearer " + token },
        });
        setRoles(response.data.data);
        setIsAllowed(true); // Başarılıysa izin var
    } catch (error) {
        // --- BURASI DEĞİŞTİ ---
        if (error.response?.status === 401) {
            setIsAllowed(false); // Yetki yok, ekranı değiştir
        } else {
            message.error("Roller alınamadı!");
        }
    } finally {
        setLoading(false);
    }
  };

  const getPermissions = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3000/api/roles/permissions", {
            headers: { Authorization: "Bearer " + token },
        });
        const data = response.data.data;
        const groups = data.privGroups.map(group => {
            return {
                ...group,
                permissions: data.privileges.filter(p => p.group === group.id)
            }
        });
        setPermissionGroups(groups);
      } catch (error) {
          console.error("Yetkiler alınamadı", error);
      }
  }

  const handleFinish = async (values) => {
    try {
        const token = localStorage.getItem("token");
        
        if (editingItem) {
            await axios.post("http://localhost:3000/api/roles/update", { 
                ...values, 
                _id: editingItem._id 
            }, {
                headers: { Authorization: "Bearer " + token },
            });
            message.success("Rol güncellendi!");
        } else {
            await axios.post("http://localhost:3000/api/roles/add", values, {
                headers: { Authorization: "Bearer " + token },
            });
            message.success("Rol eklendi!");
        }

        setIsModalOpen(false);
        form.resetFields();
        setEditingItem(null);
        getRoles();

    } catch (error) {
        message.error("İşlem başarısız: " + (error.response?.data?.error?.message || "Hata"));
    }
  };

  const handleEdit = (record