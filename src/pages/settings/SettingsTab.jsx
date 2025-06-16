import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Settings from "./Tabs";
import BotConfigForm from "./Tabs/BotConfigForm";
import { useTranslation } from "react-i18next";

function SettingsTabs() {
  const { t } = useTranslation();
  return (
    <div className="flex w-full flex-col gap-6">
      <Tabs defaultValue="bot">
        <TabsList>
          <TabsTrigger value="settings">Do'kon boshqaruvi</TabsTrigger>
          <TabsTrigger value="bot">Telegram bot</TabsTrigger>
        </TabsList>
        <TabsContent value="settings">
          <Settings />
        </TabsContent>
        <TabsContent value="bot">
          <BotConfigForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
export default SettingsTabs;
