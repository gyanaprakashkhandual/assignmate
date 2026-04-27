import ChatSessionDetailPage from "@/app/modules/chat/pages/Chat.detail.page";

export const metadata = {
  title: "Ask for assignment",
  description: "Chat page in details",
};

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return (
    <div>
      <ChatSessionDetailPage params={params} />
    </div>
  );
}
