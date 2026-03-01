import type { Metadata } from "next";
import { getSharedCanvasMetadata } from "@/lib/share-server";

type Props = {
  params: Promise<{ token: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { token } = await params;
    const data = await getSharedCanvasMetadata(token);

    if (!data) {
      return {
        title: "StreamLn - Shared Canvas",
        robots: { index: false, follow: false },
      };
    }

    const title = `${data.canvasName} - ${data.projectName} | StreamLn`;
    const description = `View ${data.canvasName} from ${data.projectName} on StreamLn`;

    return {
      title,
      description,
      robots: { index: false, follow: false },
      openGraph: {
        title,
        description,
        type: "website",
        siteName: "StreamLn",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
      },
    };
  } catch {
    return {
      title: "StreamLn - Shared Canvas",
      robots: { index: false, follow: false },
    };
  }
}

export default function SharedCanvasLayout({ children }: Props) {
  return children;
}
