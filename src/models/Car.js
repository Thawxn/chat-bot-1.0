import { Schema, model } from 'mongoose';

// Define o esquema (Schema) para o modelo de Carro
const CarSchema = new Schema(
  {
    // Campo para o fabricante do carro (obrigatório)
    automaker: { type: String, required: true },

    // Campo para o nome do motor do carro (obrigatório)
    engine_name: { type: String, required: true },

    // Campo para o tipo de motor do carro (obrigatório)
    engine: { type: String, required: true },

    // Campo para inicio de fabricação do motor (obrigatório)
    year_init: { type: Number, required: true },

    // Campo para o fim da fabricação do carro (obrigatório)
    year_end: { type: Number, required: true },

    // Campo para o número de cilindros do motor do carro (obrigatório)
    cylinder: { type: Number, required: true },

    // Campo para o número de marchas do carro (obrigatório)
    gear: { type: Number, required: true },

    // Campo para o tipo de óleo do motor (obrigatório)
    exact_quantity: { type: Number, required: true },

    // Campo para a quantidade de óleo do motor (obrigatório)
    oil_quantity: { type: Number, required: true },

    // Campo para a viscosidade recomendada do motor (obrigatório)
    viscosity: { type: String, required: true },

    // Campo para a referência ao modelo 'Oil' por meio do ObjectId
    oil: { type: Schema.Types.ObjectId, ref: 'Oil' },

    // Campo para a referência ao modelo 'OilFilter' por meio do ObjectId
    oilFilter: { type: Schema.Types.ObjectId, ref: 'OilFilter' },
  },
  {
    // Adiciona automaticamente campos de timestamp (createdAt, updatedAt)
    timestamps: true,
  },
);

// Cria e exporta o modelo 'Car' com base no esquema definido
export default model('Car', CarSchema);
