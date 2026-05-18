// FormProduct.tsx
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';
import { useEffect } from 'react';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { SectionFormProduct } from './SectionFormProduct';
import { InputForm } from './InputForm';
import { FeaturesInput } from './FeaturesInput';
import { generateSlug, normalizeText } from '@/helpers';
import { VariantsInput } from './VariantsInput';
import { UploaderImages } from './UploaderImages';
import { Editor } from './Editor';
import { Box, Button, IconButton, Typography } from '@mui/material';
import { Loader } from '@shared/components';
import { JSONContent } from '@tiptap/react';
import {
  useCreateProduct,
  useGetProductBySlugAdmin,
  useUpdateProduct,
} from '@features/admin/hooks';
import { useAllCategories } from '@features/admin/hooks/category/useAllCategories';
import {
  ProductFormValues,
  productSchema,
} from '@features/admin/schema/productSchema';

interface Props {
  titleForm: string;
}

export const FormProduct = ({ titleForm }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
  } = useForm<ProductFormValues>({
    resolver: yupResolver(productSchema),
  });

  const { slug } = useParams<{ slug: string }>();
  const { product, isLoading } = useGetProductBySlugAdmin(slug);

  const { mutate: createProduct, isPending } = useCreateProduct();
  const { mutate: updateProduct, isPending: isUpdatePending } =
    useUpdateProduct(product?.id || '');

  const { categories } = useAllCategories();
  const navigate = useNavigate();

  useEffect(() => {
    if (product && !isLoading) {
      setValue('name', product.name);
      setValue('slug', product.slug);
      setValue('brand', product.brand ?? '');
      setValue('category_id', product.category_id ?? '');
      setValue('features', product.features.map((f) => ({ value: f })));
      setValue('description', product.description as JSONContent);
      setValue('images', product.images);
      setValue(
        'variants',
        product.variants.map((v) => ({
          id: v.id,
          stock: Number(v.stock),
          price: Number(v.price),
          original_price:
            v.original_price && Number(v.original_price) > 0
              ? Number(v.original_price)
              : null,
          storage: v.storage || '',
          color: v.color || '',
          colorName: v.color_name || '',
          finish: v.finish || '',
        }))
      );
    }
  }, [product, isLoading, setValue]);

  const onSubmit = (data: ProductFormValues) => {
    const mappedVariants =
      data.variants?.map((v) => {
        const price = Number(v.price);
        const rawOriginalPrice = v.original_price ? Number(v.original_price) : 0;
        let finalOriginalPrice: number | null = null;
        if (rawOriginalPrice > price) finalOriginalPrice = rawOriginalPrice;

        return {
          id: v.id,
          stock: Number(v.stock),
          price,
          original_price: finalOriginalPrice,
          storage: normalizeText(v.storage),
          color: v.color,
          color_name: normalizeText(v.colorName),
          finish: normalizeText(v.finish || null),
        };
      }) ?? [];

    const productPayload = {
      name: data.name.trim(),
      brand: data.brand?.trim() ?? '',
      category_id: data.category_id,
      slug: data.slug,
      description: data.description,
      features: data.features?.map((f) => f.value.trim()) ?? [],
      images: data.images ?? [],
      variants: mappedVariants,
      is_active: true,
    };

    if (slug) {
      updateProduct(productPayload);
    } else {
      createProduct(productPayload);
    }
  };

  const watchName = watch('name');

  useEffect(() => {
    if (slug) return;
    if (!watchName) return;
    setValue('slug', generateSlug(watchName), { shouldValidate: true });
  }, [watchName, setValue, slug]);

  if (isPending || isUpdatePending || isLoading) return <Loader />;

  // Botones de acción reutilizables
  const ActionButtons = () => (
    <Box
      sx={{
        display: 'flex',
        gap: { xs: 1, sm: 1.5 },
        justifyContent: 'flex-end',
        flexWrap: { xs: 'wrap', sm: 'nowrap' },
      }}
    >
      <Button
        variant="outlined"
        onClick={() => navigate(-1)}
        sx={{
          flex: { xs: 1, sm: 'none' },
          textTransform: 'none',
          fontSize: { xs: '0.8rem', sm: '0.875rem' },
          py: { xs: 0.75, sm: 1 },
        }}
      >
        Cancelar
      </Button>
      <Button
        variant="contained"
        type="submit"
        sx={{
          flex: { xs: 1, sm: 'none' },
          backgroundColor: '#0007d7ff',
          textTransform: 'none',
          fontSize: { xs: '0.8rem', sm: '0.875rem' },
          py: { xs: 0.75, sm: 1 },
          '&:hover': { backgroundColor: '#0005a0ff' },
        }}
      >
        Guardar Producto
      </Button>
    </Box>
  );

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: { xs: 1.5, sm: 2, md: 2.5 },
        width: '100%',
        maxWidth: '100%',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 1.5,
        }}
      >
        {/* Título + botones de accion */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.75, sm: 1 } }}>
          <IconButton
            onClick={() => navigate(-1)}
            sx={{
              transition: 'all 400ms',
              '&:hover': { transform: 'scale(1.05)' },
              p: { xs: 0.25, sm: 0.5 },
            }}
          >
            <ArrowBackIosIcon sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }} />
          </IconButton>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              textTransform: 'capitalize',
              fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
            }}
          >
            {titleForm}
          </Typography>
        </Box>

        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
          <ActionButtons />
        </Box>
      </Box>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: { xs: 1.5, sm: 2, md: 2.5 },
            width: '100%',
          }}
        >
          {/* Info basica */}
          <SectionFormProduct titleSection="Información básica">
            <InputForm
              type="text"
              placeholder="Ej: Esmalte Sintético"
              label="Titulo*"
              name="name"
              register={register}
              errors={errors}
              required
            />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 0.3, sm: 0.5 }, mt: 1 }}>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 'bold',
                  textTransform: 'capitalize',
                  fontSize: { xs: '0.65rem', sm: '0.75rem' },
                }}
              >
                Descripción*:
              </Typography>
              <Editor
                setValue={setValue}
                errors={errors}
                initialContent={product?.description as JSONContent | undefined}
              />
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 0.3, sm: 0.5 }, mt: 1, mb: 1 }}>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 'bold',
                  textTransform: 'capitalize',
                  fontSize: { xs: '0.65rem', sm: '0.75rem' },
                }}
              >
                Imágenes*:
              </Typography>
              <UploaderImages errors={errors} setValue={setValue} watch={watch} />
            </Box>

            <InputForm
              type="text"
              label="Categoría*"
              name="category_id"
              placeholder="Selecciona una categoría"
              register={register}
              errors={errors}
              required
              options={categories.map((cat) => ({ value: cat.id, label: cat.name }))}
              watch={watch}
              setValue={setValue}
            />
          </SectionFormProduct>

          {/* ── Sección 2: Marca y Características ── */}
          <SectionFormProduct titleSection="Marca y Características">
            <InputForm
              type="text"
              label="Marca"
              name="brand"
              placeholder="Ej: DaMa"
              register={register}
              errors={errors}
            />
            <Box sx={{ mt: 1, mb: 1 }}>
              <FeaturesInput control={control} errors={errors} />
            </Box>
          </SectionFormProduct>

          {/* ── Sección 4: Variantes ── */}
          <SectionFormProduct titleSection="Variantes del Producto">
            <VariantsInput
              control={control}
              errors={errors}
              register={register}
              setValue={setValue}
            />
          </SectionFormProduct>
        </Box>

        {/* Botones abajo — siempre visibles */}
        <Box
          sx={{
            display: 'flex',
            gap: { xs: 1, sm: 1.5 },
            justifyContent: { xs: 'stretch', sm: 'flex-end' },
            flexWrap: { xs: 'wrap', sm: 'nowrap' },
            mt: { xs: 1.5, sm: 2 },
          }}
        >
          <Button
            variant="outlined"
            onClick={() => navigate(-1)}
            sx={{
              flex: { xs: 1, sm: 'none' },
              textTransform: 'none',
              fontSize: { xs: '0.8rem', sm: '0.875rem' },
              py: { xs: 0.75, sm: 1 },
            }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            type="submit"
            sx={{
              flex: { xs: 1, sm: 'none' },
              backgroundColor: '#0007d7ff',
              textTransform: 'none',
              fontSize: { xs: '0.8rem', sm: '0.875rem' },
              py: { xs: 0.75, sm: 1 },
              '&:hover': { backgroundColor: '#0005a0ff' },
            }}
          >
            Guardar Producto
          </Button>
        </Box>
      </form>
    </Box>
  );
};