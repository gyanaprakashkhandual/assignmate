import PDFShowcase from "@/app/modules/downloads/pages/Download.page"

export const metadata = {
  title: "Downloads",
  description: "Download history page"
}

export default function Page () {
  return (
    <div>
      <PDFShowcase sessions={[]}/>
    </div>
  )
}