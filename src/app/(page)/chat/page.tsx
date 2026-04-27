import ChatPage from "@/app/modules/chat/pages/Chat.page";

export const metadata = {
  title: "Ask for assignment",
  description: "Chat page",
};

export default function page() {
  return (
    <div>
      <ChatPage params={Promise.resolve({ sessionId: "" })} />
    </div>
  );
}
