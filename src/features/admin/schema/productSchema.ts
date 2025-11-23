import { JSONContent } from "@tiptap/react";
import * as yup from 'yup';

const isContentEmpty = (value: JSONContent): boolean => {
	if (
		!value ||
		!Array.isArray(value.content) ||
		value.content.length === 0
	) {
		return true;
	}

	return !value.content.some(
		node =>
			node.type === 'paragraph' &&
			node.content &&
			Array.isArray(node.content) &&
			node.content.some(
				textNode =>
					textNode.type === 'text' &&
					textNode.text &&
					textNode.text.trim() !== ''
			)
	);
};

export const productSchema = yup.object().shape({
	name: yup
		.string()
		.required('El nombre del producto es obligatorio')
		.typeError('El nombre debe ser un texto'),
	brand: yup
		.string()
		.required('La marca del producto es obligatoria')
		.typeError('La marca debe ser un texto'),
	slug: yup
		.string()
		.required('El slug del producto es obligatorio')
		.matches(
			/^[a-z0-9]+(?:-[a-z0-9]+)*$/,
			'Slug inválido'
		)
		.typeError('El slug debe ser un texto'),
	features: yup.array(
		yup.object().shape({
			value: yup
				.string()
				.required('La característica no puede estar vacía')
				.typeError('La característica debe ser un texto'),
		})
	).typeError('Las características deben ser un array'),
	description: yup
		.mixed<JSONContent>()
		.required('La descripción no puede estar vacía')
		.test(
			'is-content-valid',
			'La descripción no puede estar vacía',
			(value) => !isContentEmpty(value as JSONContent)
		),
	variants: yup
		.array(
			yup.object().shape({
				id: yup.string().optional(),
				stock: yup
					.number()
					.required('El stock es requerido')
					.typeError('El stock debe ser un número')
					.min(1, 'El stock debe ser mayor a 0'),
				price: yup
					.number()
					.required('El precio es requerido')
					.typeError('El precio debe ser un número')
					.min(0.01, 'El precio debe ser mayor a 0'),
				storage: yup
					.string()
					//.required('El almacenamiento es requerido')
					.typeError('El almacenamiento debe ser un texto'),
				color: yup
					.string()
					//.required('El color es requerido')
					.typeError('El color debe ser un texto'),
					/* .matches(
						/^(#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})|(rgb|hsl)a?\(\s*([0-9]{1,3}\s*,\s*){2}[0-9]{1,3}\s*(,\s*(0|1|0?\.\d+))?\s*\))$/,
						'El color debe ser un valor válido en formato hexadecimal, RGB o HSL'
					), */
				colorName: yup
					.string()
					//.required('El nombre del color es obligatorio')
					.typeError('El nombre del color debe ser un texto'),
				finish: yup
					.string()
					//.required('La terminación es requerida')
					.typeError('La terminación debe ser un texto'),
			})
		)
		.min(1, 'Debe haber al menos una variante')
		.typeError('Las variantes deben ser un array'),
	images: yup
		.array()
		.min(1, 'Debe haber al menos una imagen')
		.max(3, 'Máximo 3 imágenes permitidas')
		.typeError('Las imágenes deben ser un array'),
});

export type ProductFormValues = yup.InferType<typeof productSchema>;