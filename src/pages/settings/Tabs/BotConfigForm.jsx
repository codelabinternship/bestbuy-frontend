import { useState } from "react";
import { useBotConfigs } from "@/hooks/useBotConfigs";
import { useTranslation } from "react-i18next";

import { Label } from "@radix-ui/react-dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";

export default function BotConfigForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    bot_token: "",
    bot_name: "",
    settings: "{}",
    status: true,
  });

  const { addBotConfigMutation } = useBotConfigs();
  const { t } = useTranslation();
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    addBotConfigMutation.mutate(formData, {
      onSuccess: () => {
        onSuccess?.();
        setFormData({
          bot_token: "",
          bot_name: "",
          settings: {},
          status: true,
        });
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4  px-10 py-7 border rounded shadow"
    >
      <div>
        <p className="text-3xl font-semibold">{t("Настройки Telegram")}</p>
        <p>{t("Введите данные для подключения к Telegram")}</p>
      </div>
      <div>
        <label className="block mb-1 font-medium">{t("Токен бота")}</label>
        <input
          type="text"
          name="bot_token"
          value={formData.bot_token}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">{t("Имя Бота")}</label>
        <input
          type="text"
          name="bot_name"
          value={formData.bot_name}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">{t("Settings")}</label>
        <textarea
          name="settings"
          value={JSON.stringify(formData.settings, null, 2)}
          onChange={(e) => {
            try {
              const parsed = JSON.parse(e.target.value);
              setFormData((prev) => ({ ...prev, settings: parsed }));
            } catch {}
          }}
          className="w-full border px-3 py-2 rounded font-mono"
        />
      </div>

      <Label className="hover:bg-accent/50 flex items-start w-[100px] gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-green-400 has-[[aria-checked=true]]:bg-green-100 dark:has-[[aria-checked=true]]:border-green-600 dark:has-[[aria-checked=true]]:bg-green-500">
        <Checkbox
          id="toggle-2"
          defaultChecked
          className="data-[state=checked]:border-green-600 data-[state=checked]:bg-green-600 data-[state=checked]:text-white dark:data-[state=checked]:border-green-500 dark:data-[state=checked]:bg-green-500"
        />
        <div className="grid gap-1.5 font-normal">
          <p className="text-sm leading-none font-medium">{t("Активный")}</p>
          {/* <p className="text-muted-foreground text-sm">
            You can enable or disable notifications at any time.
          </p> */}
        </div>
      </Label>

      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Сохранить Telegram
      </button>
    </form>
  );
}
