import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getUserSettings, updateUserSettings, UserSettings, UpdateSettingsRequest } from "../../services/user.service";

type ToggleSwitchProps = {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
};

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  label,
  description,
  checked,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-600">
      <div className="flex flex-col">
        <span className="text-white font-urbanist text-lg font-medium">{label}</span>
        {description && (
          <span className="text-gray-400 font-urbanist text-sm mt-1">{description}</span>
        )}
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-700"></div>
      </label>
    </div>
  );
};

type SelectFieldProps = {
  label: string;
  description?: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
};

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  description,
  value,
  options,
  onChange,
}) => {
  return (
    <div className="py-4 border-b border-gray-600">
      <div className="flex flex-col mb-2">
        <span className="text-white font-urbanist text-lg font-medium">{label}</span>
        {description && (
          <span className="text-gray-400 font-urbanist text-sm mt-1">{description}</span>
        )}
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 px-4 py-2 bg-gray-600 text-white font-urbanist text-base rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-700 w-full max-w-xs"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await getUserSettings();
      setSettings(data);
      setHasChanges(false);
    } catch (error: any) {
      console.error("Error loading settings:", error);
      toast.error(error.message || "Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (updates: UpdateSettingsRequest) => {
    try {
      setSaving(true);
      const updated = await updateUserSettings(updates);
      setSettings(updated);
      setHasChanges(false);
      toast.success("Settings updated successfully");
    } catch (error: any) {
      console.error("Error updating settings:", error);
      toast.error(error.message || "Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleChange = (field: keyof UserSettings, value: boolean) => {
    if (!settings) return;
    const updated = { ...settings, [field]: value };
    setSettings(updated);
    setHasChanges(true);
    handleUpdate({ [field]: value });
  };

  const handleSelectChange = (field: keyof UserSettings, value: string) => {
    if (!settings) return;
    const updated = { ...settings, [field]: value };
    setSettings(updated);
    setHasChanges(true);
    handleUpdate({ [field]: value as any });
  };

  if (loading) {
    return (
      <div className="px-20 py-10">
        <div className="text-white font-urbanist text-xl">Loading settings...</div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="px-20 py-10">
        <div className="text-white font-urbanist text-xl">Failed to load settings</div>
      </div>
    );
  }

  return (
    <div className="px-20 py-10">
      <div className="max-w-3xl">
        <h1 className="text-white font-urbanist text-3xl font-bold mb-8">User Settings</h1>

        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-white font-urbanist text-xl font-semibold mb-4">
            Notifications
          </h2>
          <ToggleSwitch
            label="Email Notifications"
            description="Receive notifications via email"
            checked={settings.emailNotifications}
            onChange={(checked) => handleToggleChange("emailNotifications", checked)}
          />
          <ToggleSwitch
            label="Push Notifications"
            description="Receive push notifications in your browser"
            checked={settings.pushNotifications}
            onChange={(checked) => handleToggleChange("pushNotifications", checked)}
          />
          <ToggleSwitch
            label="SMS Notifications"
            description="Receive notifications via SMS"
            checked={settings.smsNotifications}
            onChange={(checked) => handleToggleChange("smsNotifications", checked)}
          />
        </div>

        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-white font-urbanist text-xl font-semibold mb-4">
            Security
          </h2>
          <ToggleSwitch
            label="Two-Factor Authentication"
            description="Add an extra layer of security to your account"
            checked={settings.twoFactorAuth}
            onChange={(checked) => handleToggleChange("twoFactorAuth", checked)}
          />
        </div>

        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-white font-urbanist text-xl font-semibold mb-4">
            Preferences
          </h2>
          <SelectField
            label="Language"
            description="Choose your preferred language"
            value={settings.language}
            options={[
              { value: "en", label: "English" },
              { value: "es", label: "Spanish" },
              { value: "fr", label: "French" },
              { value: "de", label: "German" },
              { value: "zh", label: "Chinese" },
              { value: "ja", label: "Japanese" },
            ]}
            onChange={(value) => handleSelectChange("language", value)}
          />
          <SelectField
            label="Theme"
            description="Choose your preferred theme"
            value={settings.theme}
            options={[
              { value: "light", label: "Light" },
              { value: "dark", label: "Dark" },
            ]}
            onChange={(value) => handleSelectChange("theme", value)}
          />
          <SelectField
            label="Currency"
            description="Choose your preferred currency"
            value={settings.currency}
            options={[
              { value: "USD", label: "USD - US Dollar" },
              { value: "EUR", label: "EUR - Euro" },
              { value: "GBP", label: "GBP - British Pound" },
              { value: "JPY", label: "JPY - Japanese Yen" },
              { value: "CNY", label: "CNY - Chinese Yuan" },
            ]}
            onChange={(value) => handleSelectChange("currency", value)}
          />
        </div>

        {hasChanges && (
          <div className="text-gray-400 font-urbanist text-sm mt-4">
            Changes are saved automatically
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;

