import { supabase } from "@/supabase/client";
import { ProductFormData } from "@/lib/validators";

export const getProducts = async (page: number = 1) => {
  const itemsPerPage = 10;
  const from = (page - 1) * itemsPerPage;
  const to = from + itemsPerPage - 1;

  const { data, error, count } = await supabase
    .from("products")
    .select("*, variants(*)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error(error);
    throw new Error("Error al obtener los productos");
  }

  return { data, count };
};

export const getProductBySlug = async (slug: string) => {
  const { data, error } = await supabase
    .from("products")
    .select("*, variants(*)")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error(error);
    throw new Error("Error al obtener el producto");
  }

  return data;
};

export const createProduct = async (productInput: ProductFormData) => {
  const { variants, images, ...productData } = productInput;

  // Subir imágenes primero
  const uploadedImages: string[] = [];
  for (const img of images) {
    if (img instanceof File) {
      const fileExt = img.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("products")
        .upload(filePath, img);

      if (uploadError) {
        console.error(uploadError);
        throw new Error("Error al subir la imagen");
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("products").getPublicUrl(filePath);

      uploadedImages.push(publicUrl);
    } else {
      uploadedImages.push(img);
    }
  }

  // Crear el producto
  const { data: product, error: productError } = await supabase
    .from("products")
    .insert({
      ...productData,
      images: uploadedImages,
      features: productData.features || [],
      category_id: null,
    })
    .select()
    .single();

  if (productError) {
    console.error(productError);
    throw new Error("Error al crear el producto");
  }

  // Crear las variantes
  const variantsWithProductId = variants.map((variant) => ({
    color: variant.color,
    color_name: variant.colorName,
    storage: variant.storage,
    price: variant.price,
    stock: variant.stock,
    product_id: product.id,
  }));

  const { error: variantsError } = await supabase
    .from("variants")
    .insert(variantsWithProductId);

  if (variantsError) {
    console.error(variantsError);
    throw new Error("Error al crear las variantes");
  }

  return product;
};

export const updateProduct = async (productId: string, productInput: ProductFormData) => {
  const { variants, images, ...productData } = productInput;

  // Subir nuevas imágenes
  const uploadedImages: string[] = [];
  for (const img of images) {
    if (img instanceof File) {
      const fileExt = img.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("products")
        .upload(filePath, img);

      if (uploadError) {
        console.error(uploadError);
        throw new Error("Error al subir la imagen");
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("products").getPublicUrl(filePath);

      uploadedImages.push(publicUrl);
    } else {
      uploadedImages.push(img);
    }
  }

  // Actualizar el producto
  const { error: productError } = await supabase
    .from("products")
    .update({
      ...productData,
      images: uploadedImages,
      features: productData.features || [],
      category_id: null,
    })
    .eq("id", productId);

  if (productError) {
    console.error(productError);
    throw new Error("Error al actualizar el producto");
  }

  // Eliminar las variantes existentes
  const { error: deleteError } = await supabase
    .from("variants")
    .delete()
    .eq("product_id", productId);

  if (deleteError) {
    console.error(deleteError);
    throw new Error("Error al eliminar las variantes existentes");
  }

  // Crear las nuevas variantes
  const variantsWithProductId = variants.map((variant) => ({
    color: variant.color,
    color_name: variant.colorName,
    storage: variant.storage,
    price: variant.price,
    stock: variant.stock,
    product_id: productId,
  }));

  const { error: variantsError } = await supabase
    .from("variants")
    .insert(variantsWithProductId);

  if (variantsError) {
    console.error(variantsError);
    throw new Error("Error al crear las nuevas variantes");
  }
};

export const deleteProduct = async (productId: string) => {
  // Eliminar las variantes
  const { error: variantsError } = await supabase
    .from("variants")
    .delete()
    .eq("product_id", productId);

  if (variantsError) {
    console.error(variantsError);
    throw new Error("Error al eliminar las variantes");
  }

  // Eliminar el producto
  const { error: productError } = await supabase
    .from("products")
    .delete()
    .eq("id", productId);

  if (productError) {
    console.error(productError);
    throw new Error("Error al eliminar el producto");
  }
};
