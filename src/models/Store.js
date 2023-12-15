import { Schema, model } from 'mongoose';

// Definição do esquema para o modelo de loja
const StoreSchema = new Schema(
  {
    // Nome da loja (obrigatório e único)
    name: { type: String, required: true, unique: true },

    // CNPJ da loja (obrigatório e único)
    cnpj: { type: String, required: true, unique: true },

    // Número de telefone da loja (obrigatório)
    phone: { type: Number, required: true },

    // Localização da loja (obrigatória)
    location: { type: String, required: true },

    // Horário de funcionamento da loja (obrigatório)
    openingHours: { type: String, required: true },

    // Descrição da loja
    description: { type: String },

    // Referência ao usuário proprietário da loja
    user: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  {
    // Configuração para incluir automaticamente os campos createdAt e updatedAt
    timestamps: true,
  },
);

// Criação do modelo 'Store' com base no esquema definido
export default model('Store', StoreSchema);
