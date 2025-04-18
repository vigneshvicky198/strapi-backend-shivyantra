import type { Schema, Attribute } from '@strapi/strapi';

export interface SubSubcategory extends Schema.Component {
  collectionName: 'components_sub_subcategories';
  info: {
    displayName: 'subcategory';
  };
  attributes: {
    tittle: Attribute.String;
    images: Attribute.Media<'images', true>;
    products: Attribute.Relation<
      'sub.subcategory',
      'oneToMany',
      'api::product.product'
    >;
  };
}

export interface ProductsProductCard extends Schema.Component {
  collectionName: 'components_products_product_cards';
  info: {
    displayName: 'ProductCard';
    icon: 'archive';
  };
  attributes: {
    ProductName: Attribute.String;
    SubTitle: Attribute.String;
    ProductImage: Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    OldPrice: Attribute.String;
    NewPrice: Attribute.String;
  };
}

export interface ProductsCategory extends Schema.Component {
  collectionName: 'components_products_categories';
  info: {
    displayName: 'Category';
    icon: 'check';
    description: '';
  };
  attributes: {
    category: Attribute.Relation<
      'products.category',
      'oneToOne',
      'api::category.category'
    >;
  };
}

export interface HomePageSection extends Schema.Component {
  collectionName: 'components_home_page_sections';
  info: {
    displayName: 'Section';
    icon: 'database';
    description: '';
  };
  attributes: {
    Title: Attribute.String;
    products: Attribute.Relation<
      'home-page.section',
      'oneToMany',
      'api::product.product'
    >;
  };
}

export interface HomePageFactoryClips extends Schema.Component {
  collectionName: 'components_home_page_factory_clips';
  info: {
    displayName: 'FactoryClips';
    icon: 'grid';
    description: '';
  };
  attributes: {
    Media: Attribute.Media<'images'>;
    Type: Attribute.Enumeration<['Video', 'Image']>;
    EmbedCode: Attribute.Text;
  };
}

export interface DeliveryWeightGroups extends Schema.Component {
  collectionName: 'components_delivery_weight_groups';
  info: {
    displayName: 'WeightGroups';
    icon: 'car';
    description: '';
  };
  attributes: {
    Weight: Attribute.Enumeration<
      [
        'Upto 250 Gms',
        'Upto 500 Gms',
        'Upto 1000 Gms',
        'Upto 1500 Gms',
        'Upto 2000 Gms',
        'Upto 2500 Gms',
        'Upto 3000 Gms',
        'Upto 3500 Gms',
        'Upto 4000 Gms',
        'Upto 4500 Gms',
        'Upto 5000 Gms',
        'Upto 5500 Gms',
        'Upto 6000 Gms',
        'Upto 6500 Gms',
        'Upto 7000 Gms',
        'Upto 7500 Gms',
        'Upto 8000 Gms',
        'Upto 8500 Gms',
        'Upto 9000 Gms',
        'Upto 9500 Gms',
        'Upto 10000 Gms',
        'Above 10000 Gms'
      ]
    >;
    baseRate: Attribute.Decimal;
    additionalRatePerKg: Attribute.Integer;
  };
}

export interface BlocksSlider extends Schema.Component {
  collectionName: 'components_blocks_sliders';
  info: {
    displayName: 'Slider';
    icon: 'collapse';
    description: '';
  };
  attributes: {
    Image: Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    MobileImage: Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'sub.subcategory': SubSubcategory;
      'products.product-card': ProductsProductCard;
      'products.category': ProductsCategory;
      'home-page.section': HomePageSection;
      'home-page.factory-clips': HomePageFactoryClips;
      'delivery.weight-groups': DeliveryWeightGroups;
      'blocks.slider': BlocksSlider;
    }
  }
}
