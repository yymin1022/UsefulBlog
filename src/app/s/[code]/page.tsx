import { getRedirectTarget } from "@/utils/ShortUrlUtil";
import { notFound, redirect } from "next/navigation";

export default async function ShortUrlPage({
    params,
}: {
    params: Promise<{ code: string }>;
}) {
    const { code } = await params;
    const targetUrl = await getRedirectTarget(code);

    if (!targetUrl) {
        notFound();
    }

    redirect(targetUrl);
}
