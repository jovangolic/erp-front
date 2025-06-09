import React from "react";
import EditSystemSettingModal from "./EditSystemSettingModal";
import EmailSettingForm from "./EmailSettingForm";
import LanguageManager from "./LanguageManager";
import LocalizedOptionManager from "./LocalizedOptionManager";
import SystemSettingForm from "./SystemSettingForm";
import SystemSettingList from "./SystemSettingsList";
import SystemStatePanel from "./SystemStatePanel";

const SystemSettings = () => {
    <div>
        <h2>SystemSettings</h2>
        <EditSystemSettingModal />
        <EmailSettingForm />
        <LanguageManager />
        <LocalizedOptionManager />
        <SystemSettingForm />
        <SystemSettingList />
        <SystemStatePanel />
    </div>
};

export default SystemSettings;