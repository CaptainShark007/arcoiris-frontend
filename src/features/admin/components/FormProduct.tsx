import { yupResolver } from "@hookform/resolvers/yup";
import { ProductFormValues, productSchema } from "../schema/productSchema";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { useEffect } from "react";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { SectionFormProduct } from "./SectionFormProduct";
import { InputForm } from "./InputForm";
import { FeaturesInput } from "./FeaturesInput";
import { generateSlug } from "@/helpers";
import { VariantsInput } from "./VariantsInput";
import { UploaderImages } from "./UploaderImages";
import { Editor } from "./Editor";
import { Box, Button, IconButton, Typography } from "@mui/material";
import { useCreateProduct, useUpdateProduct } from "../hooks";
import { Loader } from "@shared/components";
import { useProduct } from "@features/product/hooks/useProduct";
import { JSONContent } from "@tiptap/react";

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
	const { product, isLoading } = useProduct(slug);

	const { mutate: createProduct, isPending } = useCreateProduct();

	const { mutate: updateProduct, isPending: isUpdatePending } = useUpdateProduct(product?.id || '');

	const navigate = useNavigate();

	useEffect(() => {
		if (product && !isLoading) {
			setValue('name', product.name);
			setValue('slug', product.slug);
			setValue('brand', product.brand);
			setValue('features', product.features.map(f => ({ value: f })));
			setValue('description', product.description as JSONContent);
			setValue('images', product.images);
			setValue('variants', product.variants.map(v => ({
				id: v.id,
				stock: v.stock,
				price: v.price,
				storage: v.storage || '', 
				color: v.color || '',
				colorName: v.color_name || '',
				finish: v.finish || '',
			})));
		}
	}, [product, isLoading, setValue]);

	const onSubmit = handleSubmit(data => {
		// console.log('data form product:', data);

		if (slug) {
			updateProduct({
				name: data.name,
				brand: data.brand,
				slug: data.slug,
				description: data.description,
				features: data.features?.map(f => f.value) ?? [],
				images: data.images ?? [],
				variants: data.variants?.map(v => ({
					id: v.id,
					stock: v.stock,
					price: v.price,
					storage: v.storage,
					color: v.color,
					color_name: v.colorName,
					finish: v.finish || null,
				})) ?? [],
			});
		} else {
			createProduct({
				name: data.name,
				brand: data.brand,
				slug: data.slug,
				description: data.description,
				features: data.features?.map(f => f.value) ?? [],
				images: data.images ?? [],
				variants: data.variants?.map(v => ({
					id: v.id,
					stock: v.stock,
					price: v.price,
					storage: v.storage,
					color: v.color,
					color_name: v.colorName,
					finish: v.finish || null,
				})) ?? [],
			});
		}

	});

	const watchName = watch('name');

	useEffect(() => {
		if (!watchName) return;
		const generatedSlug = generateSlug(watchName);
		setValue('slug', generatedSlug, { shouldValidate: true });
	}, [watchName, setValue]);

	if (isPending || isUpdatePending || isLoading) return <Loader />;

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, position: 'relative', pb: 10 }}>
			<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
					<IconButton
						onClick={() => navigate(-1)}
						sx={{
							//bgcolor: 'white',
							//border: '1px solid #e2e8f0',
							transition: 'all 400ms',
							'&:hover': { transform: 'scale(1.05)' },
						}}
					>
						<ArrowBackIosIcon sx={{ fontSize: '1.2rem' }} />
					</IconButton>
					<Typography variant="h5" sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
						{titleForm}
					</Typography>
				</Box>
			</Box>

			<Box
				component="form"
				onSubmit={onSubmit}
				sx={{
					display: 'grid',
					gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
					gap: 3,
					alignContent: 'start',
				}}
			>
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

				<SectionFormProduct titleSection='Variantes del Producto'>
					<VariantsInput
						control={control}
						errors={errors}
						register={register}
					/>
				</SectionFormProduct>

				<SectionFormProduct titleSection='Imágenes del producto'>
					<UploaderImages
						errors={errors}
						setValue={setValue}
						watch={watch}
					/>
				</SectionFormProduct>

				<Box sx={{ gridColumn: 'span', lg: { gridColumn: '1/-1' } }}>
					<SectionFormProduct titleSection='Descripción del producto' >
						<Editor setValue={setValue} errors={errors} initialContent={product?.description as JSONContent | undefined} />
					</SectionFormProduct>
				</Box>

				<Box
					sx={{
						display: 'flex',
						gap: 1.5,
						position: 'absolute',
						top: 0,
						right: 0,
					}}
				>
					<Button
						variant="outlined"
						onClick={() => navigate(-1)}
					>
						Cancelar
					</Button>
					<Button
						variant="contained"
						type='submit'
						sx={{ backgroundColor: '#0007d7ff' }}
					>
						Guardar Producto
					</Button>
				</Box>
			</Box>
		</Box>
	);
};