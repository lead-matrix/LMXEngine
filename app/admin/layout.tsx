import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import AdminLayoutClient from "@/components/admin/AdminLayoutClient";

export const dynamic = "force-dynamic";

export const metadata = {
    title: {
        default: "Admin Palace | DINA COSMETIC",
        template: "%s | Admin Palace"
    }
};

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createAdminClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    // 1. Authentication Check
    if (!user) {
        redirect("/login");
    }

    // 2. Authorization (RBAC) Check
    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (!profile || profile.role !== "admin") {
        redirect("/");
    }

    return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
