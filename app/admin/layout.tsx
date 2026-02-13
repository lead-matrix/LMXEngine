import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminLayoutClient from "@/components/admin/AdminLayoutClient";

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
    const supabase = await createClient();

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
