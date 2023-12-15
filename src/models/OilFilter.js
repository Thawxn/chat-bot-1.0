import { Schema, model } from 'mongoose';

// Definição do esquema para a coleção Filtro de Óleo
const OilFilterSchema = new Schema(
  {
    // Nome do filtro de óleo (String) - Campo obrigatório
    name: { type: String, required: true },

    // especificação do filtro óleo (String) - Campo obrigatório
    specification: { type: String, required: true },

    // Preço do filtro de óleo (Number) - Campo obrigatório
    price: { type: Number, required: true },
  },
  // Configuração adicional: timestamps adiciona createdAt e updatedAt automaticamente
  {
    timestamps: true,
  },
);

// Exportação do modelo 'OilFilter' associado ao esquema OilFilterSchema
export default model('OilFilter', OilFilterSchema);
