import type { IconName } from "@/components/icons";

export type ProductItem = {
  label: string;
  sub: string;
  price: number;
};

export type Product = {
  id: string;
  nama: string;
  tag: string;
  icon: IconName;
  inputLabel: string;
  placeholder: string;
  hint: string;
  targetLabel: string;
  min: number;
  admin: number;
  items: ProductItem[];
};

export type Faq = {
  q: string;
  a: string;
};

export type Testimonial = {
  initial: string;
  name: string;
  city: string;
  quote: string;
};

export type WhyItem = {
  value: string;
  title: string;
  desc: string;
};

export type StepItem = {
  title: string;
  desc: string;
};

export type LegalSection = {
  id: string;
  num: string;
  title: string;
  paragraphs?: string[];
  items?: string[];
  note?: string;
};

export type LegalDoc = {
  title: string;
  description: string;
  intro: string;
  sections: LegalSection[];
  cta: {
    title: string;
    desc: string;
    href: string;
    label: string;
  };
};
