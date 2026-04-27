import ChatPage from "@/app/modules/chat/pages/Chat.page";

export default function Page() {
  return (
    <div>
      <ChatPage params={Promise.resolve({ sessionId: "" })} />
    </div>
  );
}
