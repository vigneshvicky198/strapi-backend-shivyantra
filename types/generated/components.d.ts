import type { Schema, Attribute } from '@strapi/strapi';

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
      'products.product-card': ProductsProductCard;
      'products.category': ProductsCategory;
      'home-page.section': HomePageSection;
      'home-page.factory-clips': HomePageFactoryClips;
      'blocks.slider': BlocksSlider;
    }
  }
}
