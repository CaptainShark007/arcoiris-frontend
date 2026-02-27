DO $$
DECLARE
  -- Obtener categorías existentes
  cat_smartphones UUID;
  cat_laptops     UUID;

  -- Nuevos productos
  prod_iphone16        UUID := gen_random_uuid();
  prod_iphone16plus    UUID := gen_random_uuid();
  prod_samsungS23      UUID := gen_random_uuid();
  prod_samsungA55      UUID := gen_random_uuid();
  prod_xiaomi14        UUID := gen_random_uuid();
  prod_xiaomiNote13    UUID := gen_random_uuid();
  prod_motorolaEdge    UUID := gen_random_uuid();
  prod_motorolaG84     UUID := gen_random_uuid();
  prod_oppoReno        UUID := gen_random_uuid();
  prod_nokiaG60        UUID := gen_random_uuid();
  prod_macbook14       UUID := gen_random_uuid();
  prod_dellXPS         UUID := gen_random_uuid();
  prod_lenovoThinkpad  UUID := gen_random_uuid();
  prod_asusZenbook     UUID := gen_random_uuid();
  prod_hpSpectre       UUID := gen_random_uuid();

BEGIN

  -- Recuperar IDs de categorías ya existentes
  SELECT id INTO cat_smartphones FROM categories WHERE slug = 'smartphones' LIMIT 1;
  SELECT id INTO cat_laptops     FROM categories WHERE slug = 'laptops'     LIMIT 1;

  -- PRODUCTOS
  INSERT INTO products (id, name, slug, brand, description, features, images, is_active, is_deleted, category_id) VALUES

  (prod_iphone16, 'iPhone 16', 'iphone-16', 'Apple',
    '{"html": "<p>iPhone 16 con chip A18 y Camera Control.</p>", "text": "iPhone 16 con chip A18 y Camera Control."}',
    ARRAY['Chip A18', 'Camera Control', 'Pantalla 6.1"', 'iOS 18'],
    ARRAY['https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800'],
    true, false, cat_smartphones),

  (prod_iphone16plus, 'iPhone 16 Plus', 'iphone-16-plus', 'Apple',
    '{"html": "<p>iPhone 16 Plus, pantalla grande con chip A18.</p>", "text": "iPhone 16 Plus, pantalla grande con chip A18."}',
    ARRAY['Chip A18', 'Pantalla 6.7"', 'Batería extendida', 'Camera Control'],
    ARRAY['https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800'],
    true, false, cat_smartphones),

  (prod_samsungS23, 'Samsung Galaxy S23', 'samsung-galaxy-s23', 'Samsung',
    '{"html": "<p>Galaxy S23 con Snapdragon 8 Gen 2 y cámara nocturna mejorada.</p>", "text": "Galaxy S23 con Snapdragon 8 Gen 2 y cámara nocturna mejorada."}',
    ARRAY['Snapdragon 8 Gen 2', 'Pantalla 6.1"', 'Cámara 50MP', 'Batería 3900mAh'],
    ARRAY['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800'],
    true, false, cat_smartphones),

  (prod_samsungA55, 'Samsung Galaxy A55', 'samsung-galaxy-a55', 'Samsung',
    '{"html": "<p>Galaxy A55, gama media premium con diseño premium.</p>", "text": "Galaxy A55, gama media premium con diseño premium."}',
    ARRAY['Exynos 1480', 'Pantalla AMOLED 6.6"', 'Cámara 50MP OIS', 'IP67'],
    ARRAY['https://images.unsplash.com/photo-1567581935884-3349723552ca?w=800'],
    true, false, cat_smartphones),

  (prod_xiaomi14, 'Xiaomi 14', 'xiaomi-14', 'Xiaomi',
    '{"html": "<p>Xiaomi 14 con Snapdragon 8 Gen 3 y cámara Leica.</p>", "text": "Xiaomi 14 con Snapdragon 8 Gen 3 y cámara Leica."}',
    ARRAY['Snapdragon 8 Gen 3', 'Cámara Leica', 'Pantalla AMOLED 6.36"', 'Carga 90W'],
    ARRAY['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800'],
    true, false, cat_smartphones),

  (prod_xiaomiNote13, 'Xiaomi Redmi Note 13 Pro', 'xiaomi-redmi-note-13-pro', 'Xiaomi',
    '{"html": "<p>Redmi Note 13 Pro con cámara de 200MP y carga turbo.</p>", "text": "Redmi Note 13 Pro con cámara de 200MP y carga turbo."}',
    ARRAY['Snapdragon 7s Gen 2', 'Cámara 200MP', 'Pantalla 6.67" 120Hz', 'Carga 67W'],
    ARRAY['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800'],
    true, false, cat_smartphones),

  (prod_motorolaEdge, 'Motorola Edge 50 Pro', 'motorola-edge-50-pro', 'Motorola',
    '{"html": "<p>Edge 50 Pro con pantalla pOLED curva y carga 125W.</p>", "text": "Edge 50 Pro con pantalla pOLED curva y carga 125W."}',
    ARRAY['Snapdragon 7 Gen 3', 'Pantalla pOLED 6.7"', 'Carga 125W', 'IP68'],
    ARRAY['https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800'],
    true, false, cat_smartphones),

  (prod_motorolaG84, 'Motorola Moto G84', 'motorola-moto-g84', 'Motorola',
    '{"html": "<p>Moto G84, la mejor relación calidad-precio de la gama media.</p>", "text": "Moto G84, la mejor relación calidad-precio de la gama media."}',
    ARRAY['Snapdragon 695', 'Pantalla pOLED 6.5"', 'Batería 5000mAh', 'Cámara 50MP'],
    ARRAY['https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800'],
    true, false, cat_smartphones),

  (prod_oppoReno, 'OPPO Reno 12 Pro', 'oppo-reno-12-pro', 'OPPO',
    '{"html": "<p>Reno 12 Pro con diseño elegante y cámara con IA generativa.</p>", "text": "Reno 12 Pro con diseño elegante y cámara con IA generativa."}',
    ARRAY['Dimensity 7300 Energy', 'Pantalla AMOLED 6.7"', 'Cámara IA 50MP', 'Carga 80W'],
    ARRAY['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800'],
    true, false, cat_smartphones),

  (prod_nokiaG60, 'Nokia G60 5G', 'nokia-g60-5g', 'Nokia',
    '{"html": "<p>Nokia G60 5G con 3 años de actualizaciones garantizadas.</p>", "text": "Nokia G60 5G con 3 años de actualizaciones garantizadas."}',
    ARRAY['Snapdragon 695', '5G', 'Pantalla 6.58"', 'Batería 4500mAh', '3 años actualizaciones'],
    ARRAY['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800'],
    true, false, cat_smartphones),

  (prod_macbook14, 'MacBook Pro 14"', 'macbook-pro-14', 'Apple',
    '{"html": "<p>MacBook Pro 14 con chip M3 Pro y pantalla Liquid Retina XDR.</p>", "text": "MacBook Pro 14 con chip M3 Pro y pantalla Liquid Retina XDR."}',
    ARRAY['Chip M3 Pro', 'Pantalla Liquid Retina XDR', 'Hasta 22h batería', 'HDMI 2.1', 'SD Card'],
    ARRAY['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800'],
    true, false, cat_laptops),

  (prod_dellXPS, 'Dell XPS 15', 'dell-xps-15', 'Dell',
    '{"html": "<p>Dell XPS 15 con pantalla OLED 4K y procesador Intel Core Ultra.</p>", "text": "Dell XPS 15 con pantalla OLED 4K y procesador Intel Core Ultra."}',
    ARRAY['Intel Core Ultra 7', 'Pantalla OLED 4K 15.6"', 'RTX 4060', '32GB RAM', 'Thunderbolt 4'],
    ARRAY['https://images.unsplash.com/photo-1611186871525-7d80d7c41d44?w=800'],
    true, false, cat_laptops),

  (prod_lenovoThinkpad, 'Lenovo ThinkPad X1 Carbon', 'lenovo-thinkpad-x1-carbon', 'Lenovo',
    '{"html": "<p>ThinkPad X1 Carbon Gen 12, ultrabook empresarial ultraligero.</p>", "text": "ThinkPad X1 Carbon Gen 12, ultrabook empresarial ultraligero."}',
    ARRAY['Intel Core Ultra 7', 'Pantalla IPS 14"', '1.12kg', 'Teclado ThinkPad', 'LTE opcional'],
    ARRAY['https://images.unsplash.com/photo-1611186871525-7d80d7c41d44?w=800'],
    true, false, cat_laptops),

  (prod_asusZenbook, 'ASUS Zenbook 14 OLED', 'asus-zenbook-14-oled', 'ASUS',
    '{"html": "<p>Zenbook 14 OLED con pantalla vibrante y Ryzen AI 9.</p>", "text": "Zenbook 14 OLED con pantalla vibrante y Ryzen AI 9."}',
    ARRAY['AMD Ryzen AI 9', 'Pantalla OLED 2.8K', 'NPU integrada', 'Batería 75Wh', 'USB4'],
    ARRAY['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800'],
    true, false, cat_laptops),

  (prod_hpSpectre, 'HP Spectre x360 14', 'hp-spectre-x360-14', 'HP',
    '{"html": "<p>Spectre x360 14, el convertible premium de HP con pantalla táctil OLED.</p>", "text": "Spectre x360 14, el convertible premium de HP con pantalla táctil OLED."}',
    ARRAY['Intel Core Ultra 7', 'Pantalla OLED táctil 2.8K', '360° convertible', 'Stylus incluido', 'Wi-Fi 6E'],
    ARRAY['https://images.unsplash.com/photo-1611186871525-7d80d7c41d44?w=800'],
    true, false, cat_laptops);

  -- VARIANTES (2-3 por producto)
  INSERT INTO variants (product_id, color, color_name, finish, storage, price, original_price, stock, is_active) VALUES

  -- iPhone 16
  (prod_iphone16, '#1C1C1E', 'Negro',   'Mate', '128GB', 899.99, NULL,    30, true),
  (prod_iphone16, '#F5F5F0', 'Blanco',  'Mate', '128GB', 899.99, NULL,    25, true),
  (prod_iphone16, '#FF6B6B', 'Rosa',    'Mate', '256GB', 999.99, NULL,    20, true),

  -- iPhone 16 Plus
  (prod_iphone16plus, '#1C1C1E', 'Negro',  'Mate', '128GB', 1099.99, NULL, 20, true),
  (prod_iphone16plus, '#F5F5F0', 'Blanco', 'Mate', '256GB', 1199.99, NULL, 15, true),

  -- Samsung S23
  (prod_samsungS23, '#1C1C1E', 'Phantom Black', 'Brillante', '128GB', 699.99, 799.99, 25, true),
  (prod_samsungS23, '#E8E0D5', 'Cream',         'Brillante', '256GB', 799.99, 899.99, 18, true),

  -- Samsung A55
  (prod_samsungA55, '#4A90D9', 'Awesome Iceblue', 'Brillante', '128GB', 449.99, 499.99, 35, true),
  (prod_samsungA55, '#1C1C1E', 'Awesome Navy',    'Brillante', '256GB', 499.99, 549.99, 28, true),

  -- Xiaomi 14
  (prod_xiaomi14, '#1C1C1E', 'Negro',  'Brillante', '256GB', 799.99, 899.99, 20, true),
  (prod_xiaomi14, '#F5F5F0', 'Blanco', 'Brillante', '512GB', 899.99, 999.99, 12, true),

  -- Redmi Note 13 Pro
  (prod_xiaomiNote13, '#1C1C1E', 'Midnight Black',  'Brillante', '256GB', 349.99, 399.99, 40, true),
  (prod_xiaomiNote13, '#7B68EE', 'Aurora Purple',   'Brillante', '256GB', 349.99, 399.99, 30, true),

  -- Motorola Edge 50 Pro
  (prod_motorolaEdge, '#1C1C1E', 'Black Beauty', 'Mate', '256GB', 499.99, 599.99, 22, true),
  (prod_motorolaEdge, '#E8D5B7', 'Vanilla Cream','Mate', '512GB', 549.99, 649.99, 15, true),

  -- Moto G84
  (prod_motorolaG84, '#1C1C1E', 'Midnight Blue', 'Brillante', '256GB', 249.99, 299.99, 45, true),
  (prod_motorolaG84, '#C0C0C0', 'Marshmallow',   'Brillante', '256GB', 249.99, 299.99, 38, true),

  -- OPPO Reno 12 Pro
  (prod_oppoReno, '#1C1C1E', 'Space Black',   'Mate', '256GB', 499.99, 549.99, 20, true),
  (prod_oppoReno, '#98D4C8', 'Nebula Silver', 'Mate', '512GB', 549.99, 599.99, 12, true),

  -- Nokia G60
  (prod_nokiaG60, '#1C1C1E', 'Midnight Black', 'Mate', '128GB', 299.99, 349.99, 30, true),
  (prod_nokiaG60, '#4A6FA5', 'Ice Blue',       'Mate', '128GB', 299.99, 349.99, 22, true),

  -- MacBook Pro 14
  (prod_macbook14, '#C0B8AE', 'Silver',   'Aluminio', '18GB/512GB', 1999.99, NULL, 12, true),
  (prod_macbook14, '#3A3A3A', 'Space Black', 'Aluminio', '18GB/1TB', 2199.99, NULL, 8,  true),

  -- Dell XPS 15
  (prod_dellXPS, '#C0C0C0', 'Platinum Silver', 'Aluminio', '16GB/512GB', 1799.99, 1999.99, 10, true),
  (prod_dellXPS, '#1C1C1E', 'Graphite',        'Aluminio', '32GB/1TB',   2199.99, 2399.99, 6,  true),

  -- ThinkPad X1 Carbon
  (prod_lenovoThinkpad, '#1C1C1E', 'Deep Black', 'Mate', '16GB/512GB', 1599.99, 1799.99, 8,  true),
  (prod_lenovoThinkpad, '#1C1C1E', 'Deep Black', 'Mate', '32GB/1TB',   1899.99, 2099.99, 5,  true),

  -- Zenbook 14 OLED
  (prod_asusZenbook, '#2C3E50', 'Ponder Blue',  'Aluminio', '16GB/512GB', 1299.99, 1399.99, 14, true),
  (prod_asusZenbook, '#1C1C1E', 'Inkwell Black','Aluminio', '32GB/1TB',   1499.99, 1599.99, 9,  true),

  -- HP Spectre x360
  (prod_hpSpectre, '#2C2C2E', 'Nightfall Black', 'Aluminio', '16GB/512GB', 1699.99, 1899.99, 10, true),
  (prod_hpSpectre, '#C8B8A2', 'Natural Silver',  'Aluminio', '32GB/1TB',   1899.99, 2099.99, 7,  true);

END $$;