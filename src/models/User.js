import { Schema, model } from 'mongoose';

// Definição do esquema para o modelo de usuário
const UserSchema = new Schema(
  {
    // Nome do usuário (obrigatório)
    name: { type: String, required: true },

    // E-mail do usuário (obrigatório e único)
    email: { type: String, required: true, unique: true },

    // Senha do usuário (obrigatória)
    password: { type: String, required: true },

    // Número de telefone do usuário (obrigatório)
    phone: { type: Number, required: true },
  },
  {
    // Configuração para incluir automaticamente os campos createdAt e updatedAt
    timestamps: true,
  },
);

// Criação do modelo 'User' com base no esquema definido
export default model('User', UserSchema);
