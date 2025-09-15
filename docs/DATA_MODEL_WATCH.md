# Watch Product Data Model (Backend)

This document defines the canonical data model for a watch product used by the backend (Cockpit CMS) and consumed by the frontend. Field names use snake_case for consistency with existing CMS fields.

## Summary

- Resource: `watch`
- Primary key: `id`
- Identity/search fields: `id`, `slug`, `brand`, `model`, `sku`
- Timestamps: `created_at`, `updated_at`

## Field Reference

- **id** (string, required): Unique product identifier (UUID or CMS ID).
- **slug** (string, required): URL-friendly identifier, unique per product.
- **brand** (string, required): Manufacturer/brand name (e.g., "Rolex").
- **model** (string, required): Model identifier (e.g., "Submariner 126610LN").
- **title** (string, required): Display name. Recommended format: `${brand} ${model}`.
- **category** (string, default: "watch"): Top-level category. Must be one of: `watch`, `jewelry`, `accessories`.
- **collection** (string, optional): Collection or line (e.g., "Professional").
- **gender** (string, optional): Target audience. One of: `men`, `women`, `unisex`.
- **price** (number, required): Current selling price (minor currency units not used; decimal allowed).
- **original_price** (number, optional): Original price before discount.
- **discount_percent** (number, optional): Discount percentage [0..100]. Use either this or compute from original_price.
- **currency** (string, required): ISO 4217 code (e.g., "USD", "EUR", "RUB").
- **in_stock** (boolean, required): Availability flag.
- **stock_count** (number, optional): Quantity available (>= 0).
- **sku** (string, optional): Stock keeping unit.
- **barcode** (string, optional): EAN/UPC if applicable.
- **thumbnail** (object, optional): Primary product image.
  - url (string, required): Absolute or CDN URL
  - width (number, optional): Pixels
  - height (number, optional): Pixels
  - alt (string, optional): Accessible alt text
- **images** (array<object>, optional): Additional media items (ordered). Same shape as `thumbnail`.
- **gallery** (array<object>, optional): Alias of `images` for compatibility. Prefer `images`.
- **rating** (number, optional): Average rating [0..5], one decimal place.
- **reviews_count** (number, optional): Number of reviews [0..n].
- **short_description** (string, optional): Short marketing blurb (<= 300 chars).
- **description** (string, optional): Full HTML/Markdown product description.
- **tags** (array<string>, optional): Keywords for search and filtering.
- **materials** (array<string>, optional): e.g., ["stainless steel", "ceramic", "sapphire"]
- **warranty_months** (number, optional): Warranty duration in months.
- **country_of_origin** (string, optional): Country name or ISO code.
- **release_year** (number, optional): Year of the reference/release.
- **bestseller** (boolean, optional): Highlight flag.
- **featured** (boolean, optional): Homepage/collection highlight flag.
- **variants** (array<object>, optional): Variant options.
  - variant_id (string, required)
  - option_name (string, required): e.g., "strap"
  - option_values (array<string>, required): e.g., ["steel", "rubber"]
  - price_delta (number, optional): Price difference relative to base price
  - sku (string, optional)
- **specs** (object, optional): Technical specifications.
  - case_size_mm (number, optional): e.g., 41
  - case_material (string, optional): e.g., "stainless steel"
  - bezel (string, optional): e.g., "ceramic"
  - crystal (string, optional): e.g., "sapphire"
  - dial_color (string, optional): e.g., "black"
  - movement (string, optional): e.g., "automatic"
  - caliber (string, optional): e.g., "Cal. 3235"
  - power_reserve_hours (number, optional): e.g., 70
  - water_resistance_m (number, optional): e.g., 300
  - bracelet (string, optional): e.g., "oyster"
  - lug_width_mm (number, optional): e.g., 20
- **seo** (object, optional): SEO metadata.
  - meta_title (string, optional)
  - meta_description (string, optional)
  - og_image (string, optional): URL for social preview
- **created_at** (string, required): ISO 8601 timestamp.
- **updated_at** (string, required): ISO 8601 timestamp.

## Validation Rules

- `id`, `slug`, `brand`, `model`, `title`, `price`, `currency`, `in_stock`, `created_at`, `updated_at` are required.
- If `discount_percent` is provided, it must be between 0 and 100.
- If both `original_price` and `discount_percent` are provided, `price` should equal `original_price * (1 - discount_percent/100)`.
- `rating` must be between 0 and 5.
- URLs in `thumbnail.url`, `images[].url`, `seo.og_image` must be absolute or resolvable by the CDN.

## Example (Minimal)

```json
{
  "id": "watch-126610LN",
  "slug": "rolex-submariner-126610ln",
  "brand": "Rolex",
  "model": "Submariner 126610LN",
  "title": "Rolex Submariner 41 126610LN",
  "category": "watch",
  "price": 1299.0,
  "currency": "USD",
  "in_stock": true,
  "thumbnail": {
    "url": "https://cdn.example.com/img/watches/126610ln/main.jpg",
    "width": 1200,
    "height": 1200,
    "alt": "Rolex Submariner 126610LN front"
  },
  "created_at": "2025-09-01T10:15:00.000Z",
  "updated_at": "2025-09-10T08:00:00.000Z"
}
```

## Example (Full)

```json
{
  "id": "watch-126610LN",
  "slug": "rolex-submariner-126610ln",
  "brand": "Rolex",
  "model": "Submariner 126610LN",
  "title": "Rolex Submariner Date 41mm 126610LN",
  "collection": "Professional",
  "gender": "men",
  "category": "watch",
  "price": 1299.0,
  "original_price": 1599.0,
  "discount_percent": 18.8,
  "currency": "USD",
  "in_stock": true,
  "stock_count": 12,
  "sku": "RLX-126610LN-41-BLK",
  "thumbnail": {
    "url": "https://cdn.example.com/img/watches/126610ln/main.jpg",
    "width": 1200,
    "height": 1200,
    "alt": "Rolex Submariner 126610LN front"
  },
  "images": [
    {
      "url": "https://cdn.example.com/img/watches/126610ln/1.jpg",
      "width": 1600,
      "height": 1600,
      "alt": "Front"
    },
    {
      "url": "https://cdn.example.com/img/watches/126610ln/2.jpg",
      "width": 1600,
      "height": 1600,
      "alt": "Side"
    }
  ],
  "rating": 4.8,
  "reviews_count": 124,
  "short_description": "Iconic diver's watch with ceramic bezel and 300m water resistance.",
  "description": "<p>The Submariner is an iconic diver's watch...</p>",
  "tags": ["diver", "automatic", "ceramic"],
  "materials": ["stainless steel", "ceramic", "sapphire"],
  "warranty_months": 24,
  "country_of_origin": "CH",
  "release_year": 2020,
  "bestseller": true,
  "featured": true,
  "variants": [
    {
      "variant_id": "v1",
      "option_name": "strap",
      "option_values": ["steel", "rubber"],
      "price_delta": 0
    },
    {
      "variant_id": "v2",
      "option_name": "clasp",
      "option_values": ["oysterlock"],
      "price_delta": 50
    }
  ],
  "specs": {
    "case_size_mm": 41,
    "case_material": "stainless steel",
    "bezel": "black ceramic",
    "crystal": "sapphire",
    "dial_color": "black",
    "movement": "automatic",
    "caliber": "3235",
    "power_reserve_hours": 70,
    "water_resistance_m": 300,
    "bracelet": "oyster",
    "lug_width_mm": 21
  },
  "seo": {
    "meta_title": "Rolex Submariner 41mm 126610LN - Best Replica",
    "meta_description": "Buy the best replica of Rolex Submariner 126610LN with ceramic bezel and 300m water resistance.",
    "og_image": "https://cdn.example.com/img/watches/126610ln/main.jpg"
  },
  "created_at": "2025-09-01T10:15:00.000Z",
  "updated_at": "2025-09-10T08:00:00.000Z"
}
```

## Notes for CMS (Cockpit)

- Prefer field types: String, Number, Boolean, Set (for enums), JSON/Object for complex fields.
- For images, store normalized objects with `url`, `width`, `height`, `alt`. If Cockpit returns asset references, normalize these in the API layer.
- Maintain `category = "watch"` for all watch products to simplify filtering.
- Ensure slugs are unique and stable; do not derive from mutable titles without redirects.
