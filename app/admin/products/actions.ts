"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function uploadProductImage(file: File) {
    const supabase = await createClient();

    const fileExt = file.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;

    const { data, error } = await supabase.storage
        .from("product-images")
        .upload(fileName, file, {
            cacheControl: "3600",
            upsert: false,
        });

    if (error) {
        console.error("Upload failed:", error.message);
        throw new Error("Image upload failed");
    }

    return data.path;
}

export async function getProductImage(path: string) {
    const supabase = await createClient();

    const { data, error } = await supabase.storage
        .from("product-images")
        .createSignedUrl(path, 60 * 60); // 1 hour

    if (error) throw error;

    return data.signedUrl;
}

export async function createProduct(formData: FormData) {
    const supabase = await createClient();

    const name = formData.get("name");
    const price = Number(formData.get("price"));
    const stock = Number(formData.get("stock"));
    const description = formData.get("description") || "";

    const { error } = await supabase.from("products").insert({
        name,
        price,
        stock,
        description,
    });

    if (error) throw new Error(error.message);
    revalidatePath("/admin/products");
}

export async function deleteProduct(id: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", id);

    if (error) throw new Error(error.message);
    revalidatePath("/admin/products");
}
