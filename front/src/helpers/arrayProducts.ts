import { IProducts } from "@/interfaces/IProducts";

export const arrayProducts: IProducts[] = [
    {
      id: 1,
      name: "Yoga Mat",
      description: "Eco-friendly yoga mat.",
      price: 30,
      stock: 50,
      imgUrl: "https://m.media-amazon.com/images/I/81Ks1unc9GL._AC_SL1500_.jpg",
      category_id: 1, // Fitness Equipment
    },
    {
      id: 2,
      name: "Dumbbell Set",
      description: "Adjustable dumbbells for strength training.",
      price: 80,
      stock: 20,
      imgUrl: "https://m.media-amazon.com/images/I/71gbrEOHVTL._AC_UF894,1000_QL80_.jpg",
      category_id: 1, // Fitness Equipment
    },
    {
      id: 3,
      name: "Resistance Bands",
      description: "Set of 5 resistance bands with varying intensity.",
      price: 25,
      stock: 100,
      imgUrl: "https://m.media-amazon.com/images/I/61qQkHyJnEL._AC_UF1000,1000_QL80_.jpg",
      category_id: 2, // Yoga Accessories
    },
    {
      id: 4,
      name: "Whey Protein",
      description: "High-quality whey protein for muscle recovery.",
      price: 50,
      stock: 40,
      imgUrl: "https://farmacityar.vtexassets.com/arquivos/ids/243162/143033_suplemento-dietario-whey-protein-sabor-vainilla-en-polvo-x-1000-g__imagen-1.jpg?v=638211443455570000",
      category_id: 3, // Supplements
    },
    {
      id: 5,
      name: "Creatine Monohydrate",
      description: "Creatine supplement to boost performance.",
      price: 35,
      stock: 60,
      imgUrl: "https://m.media-amazon.com/images/I/71UelFPbbUL._AC_SL1500_.jpg",
      category_id: 3, // Supplements
    },
    {
      id: 6,
      name: "Jump Rope",
      description: "Adjustable jump rope for cardio workouts.",
      price: 15,
      stock: 80,
      imgUrl: "https://m.media-amazon.com/images/I/71IvvnKBSpL.jpg",
      category_id: 1, // Fitness Equipment
    },
    {
      id: 7,
      name: "Foam Roller",
      description: "High-density foam roller for muscle recovery.",
      price: 20,
      stock: 30,
      imgUrl: "https://acdn.mitiendanube.com/stores/002/293/786/products/acf173-ne-f-7c8aa5c1d4551af31517224549250827-1024-1024.jpg",
      category_id: 2, // Yoga Accessories
    },
    {
      id: 8,
      name: "Energy Bars",
      description: "Protein-rich energy bars for on-the-go nutrition.",
      price: 10,
      stock: 150,
      imgUrl: "https://m.media-amazon.com/images/I/71M-2PGXa5L._AC_UF1000,1000_QL80_.jpg",
      category_id: 3, // Supplements
    },
  ];
  
  export const categories = [
    {
      id: 1,
      name: "Fitness Equipment",
    },
    {
      id: 2,
      name: "Yoga Accessories",
    },
    {
      id: 3,
      name: "Supplements",
    },
  ];