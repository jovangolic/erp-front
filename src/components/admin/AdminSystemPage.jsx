import React, { useState } from "react";
import SystemSettingList from "./SystemSettings/SystemSettingsList";
import SystemSettingForm from "./SystemSettings/SystemSettingForm";

const AdminSystemPage = () => {
  const [selectedSetting, setSelectedSetting] = useState(null);
  const [refresh, setRefresh] = useState(false);

  const handleEdit = (setting) => {
    setSelectedSetting(setting);
  };

  const handleFinish = () => {
    setSelectedSetting(null);
    setRefresh(prev => !prev); // okida re-render liste
  };

  return (
    <div>
      <SystemSettingForm selectedSetting={selectedSetting} onFinish={handleFinish} />
      <SystemSettingList key={refresh} onEdit={handleEdit} />
    </div>
  );
};

export default AdminSystemPage;