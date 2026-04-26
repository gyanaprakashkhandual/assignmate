import ChatPage from "@/app/modules/chat/pages/Chat.page";

export const metadata = {
  title: "Chats",
  description: "Chat page",
};

export default function page() {
  return (
    <div>
      <ChatPage/>
    </div>
  );
}
