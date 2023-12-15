import { Schema, model } from 'mongoose';

// Definição do esquema para a coleção Oil
const OilSchema = new Schema(
  {
    // Nome do óleo (String) - Campo obrigatório
    name: { type: String, required: true },

    // Viscosidade do óleo (String) - Campo obrigatório
    viscosity: { type: String, required: true },

    // Preço do óleo (Number) - Campo obrigatório
    price: { type: Number, required: true },
  },
  // Configuração adicional: timestamps adiciona createdAt e updatedAt automaticamente
  {
    timestamps: true,
  },
);

// Exportação do modelo 'Oil' associado ao esquema OilSchema
export default model('Oil', OilSchema);
