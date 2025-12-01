import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';
import { useEffect } from 'react';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { SectionFormProduct } from './SectionFormProduct';
import { InputForm } from './InputForm';
import { FeaturesInput } from './FeaturesInput';
import { generateSlug } from '@/helpers';
import { VariantsInput } from './VariantsInput';
import { UploaderImages } from './UploaderImages';
import { Editor } from './Editor';
import { Box, Button, IconButton, Typography } from '@mui/material';
import { Loader } from '@shared/components';
//import { useProduct } from '@features/product/hooks/useProduct';
import { JSONContent } from '@tiptap/react';
import { useCreateProduct, useGetProductBySlugAdmin, useUpdateProduct } from '@features/admin/hooks';
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
  //const { product, isLoading } = useProduct(slug);
  const { product, isLoading } = useGetProductBySlugAdmin(slug);

  const { mutate: createProduct, isPending } = useCreateProduct();
  const { mutate: updateProduct, isPending: isUpdatePending } =
    useUpdateProduct(product?.id || '');

  const navigate = useNavigate();

  useEffect(() => {
    if (product && !isLoading) {
      setValue('name', product.name);
      setValue('slug', product.slug);
      setValue('brand', product.brand);
      setValue(
        'features',
        product.features.map((f) => ({ value: f }))
      );
      setValue('description', product.description as JSONContent);
      setValue('images', product.images);
      setValue(
        'variants',
        product.variants.map((v) => ({
          id: v.id,
          stock: v.stock,
          price: v.price,
          storage: v.storage || '',
          color: v.color || '',
          colorName: v.color_name || '',
          finish: v.finish || '',
        }))
      );
    }
  }, [product, isLoading, setValue]);

  const onSubmit = (data: ProductFormValues) => {
    if (slug) {
      updateProduct({
        name: data.name,
        brand: data.brand,
        slug: data.slug,
        description: data.description,
        features: data.features?.map((f) => f.value) ?? [],
        images: data.images ?? [],
        variants:
          data.variants?.map((v) => ({
            id: v.id,
            stock: v.stock,
            price: v.price,
            storage: v.storage,
            color: v.color,
            color_name: v.colorName,
            finish: v.finish || null,
          })) ?? [],
        is_active: true,
      });
    } else {
      createProduct({
        name: data.name,
        brand: data.brand,
        slug: data.slug,
        description: data.description,
        features: data.features?.map((f) => f.value) ?? [],
        images: data.images ?? [],
        variants:
          data.variants?.map((v) => ({
            id: v.id,
            stock: v.stock,
            price: v.price,
            storage: v.storage,
            color: v.color,
            color_name: v.colorName,
            finish: v.finish || null,
          })) ?? [],
        is_active: true,
      });
    }
  };

  const watchName = watch('name');

  useEffect(() => {
    if (!watchName) return;
    const generatedSlug = generateSlug(watchName);
    setValue('slug', generatedSlug, { shouldValidate: true });
  }, [watchName, setValue]);

  if (isPending || isUpdatePending || isLoading) return <Loader />;

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
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 0.75, sm: 1 },
          }}
        >
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
            variant='h6'
            sx={{
              fontWeight: 'bold',
              textTransform: 'capitalize',
              fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
            }}
          >
            {titleForm}
          </Typography>
        </Box>
      </Box>

      {/* Form Grid */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box
          //component="form"
          //onSubmit={onSubmit}
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: '1fr',
              md: '1fr',
              lg: '2fr 1fr',
            },
            gap: { xs: 1.5, sm: 2, md: 2.5 },
            alignContent: 'start',
            width: '100%',
            maxWidth: '100%',
            overflow: 'hidden',
          }}
        >
          {/* Detalles del Producto */}
          <SectionFormProduct titleSection='Detalles del Producto'>
            <InputForm
              type='text'
              placeholder='Ejemplo: Esmalte Sintético'
              label='nombre'
              name='name'
              register={register}
              errors={errors}
              required
            />
            <FeaturesInput control={control} errors={errors} />
          </SectionFormProduct>

          {/* Datos adicionales */}
          <SectionFormProduct>
            <InputForm
              type='text'
              label='Slug'
              name='slug'
              placeholder='esmalte-sintetico'
              register={register}
              errors={errors}
            />
            <InputForm
              type='text'
              label='Marca'
              name='brand'
              placeholder='DaMa'
              register={register}
              errors={errors}
              required
            />
          </SectionFormProduct>

          {/* Variantes */}
          <Box sx={{ gridColumn: { xs: 'span', sm: 'span', lg: '1 / -1' } }}>
            <SectionFormProduct titleSection='Variantes del Producto'>
              <VariantsInput
                control={control}
                errors={errors}
                register={register}
              />
            </SectionFormProduct>
          </Box>

          {/* Imágenes */}
          <Box sx={{ gridColumn: { xs: 'span', sm: 'span', lg: '1 / -1' } }}>
            <SectionFormProduct titleSection='Imágenes del producto'>
              <UploaderImages
                errors={errors}
                setValue={setValue}
                watch={watch}
              />
            </SectionFormProduct>
          </Box>

          {/* Descripción */}
          <Box sx={{ gridColumn: { xs: 'span', sm: 'span', lg: '1 / -1' } }}>
            <SectionFormProduct titleSection='Descripción del producto'>
              <Editor
                setValue={setValue}
                errors={errors}
                initialContent={product?.description as JSONContent | undefined}
              />
            </SectionFormProduct>
          </Box>
        </Box>

        {/* Action Buttons */}
        <Box
          sx={{
            display: 'flex',
            gap: { xs: 1, sm: 1.5 },
            justifyContent: { xs: 'stretch', sm: 'flex-end' },
            flexWrap: { xs: 'wrap', sm: 'nowrap' },
            mt: { xs: 1, sm: 1.5 },
          }}
        >
          <Button
            variant='outlined'
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
            variant='contained'
            type='submit'
            sx={{
              flex: { xs: 1, sm: 'none' },
              backgroundColor: '#0007d7ff',
              textTransform: 'none',
              fontSize: { xs: '0.8rem', sm: '0.875rem' },
              py: { xs: 0.75, sm: 1 },
              '&:hover': {
                backgroundColor: '#0005a0ff',
              },
            }}
          >
            Guardar Producto
          </Button>
        </Box>
      </form>
    </Box>
  );
};
