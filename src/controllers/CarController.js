// Importa o módulo Yup para validação de esquemas
import * as Yup from 'yup';

// Importa o modelo de Carro definido em '../models/Car.js'
import Car from '../models/Car.js';

// Define a classe CarController responsável por lidar com as operações relacionadas a Carros
class CarController {
  // Método para buscar todos os carros no banco de dados
  async index(req, res) {
    try {
      // Busca todos os carros no banco de dados
      const response = await Car.find();

      // Retorna a resposta em formato JSON
      return res.status(200).json(response);
    } catch (err) {
      // Em caso de erro, loga o erro e retorna uma resposta de erro
      console.error('Erro ao buscar carros:', err);
      return res.status(500).json({ err: 'Erro ao buscar carros' });
    }
  }

  // Método para buscar carros com base em parâmetros específicos
  async indexOne(req, res) {
    // Obtém parâmetros da requisição (fabricante e tipo de motor)
    const { automaker, engine } = req.params;

    try {
      // Cria um objeto de consulta para a busca no banco de dados
      const searchQuery = {};

      // Adiciona condições à consulta com base nos parâmetros fornecidos
      if (automaker) {
        searchQuery.automaker = automaker;
      }

      if (engine) {
        searchQuery.engine = engine;
      }

      // Realiza a busca no banco de dados com base na consulta
      const searchResults = await Car.find(searchQuery);

      // Retorna os resultados da busca ou uma mensagem de nenhum resultado encontrado
      if (searchResults.length > 0) {
        return res.status(200).json(searchResults);
      }

      return res.status(404).json({ message: 'Nenhum resultado encontrado.' });
    } catch (err) {
      // Em caso de erro, loga o erro e retorna uma resposta de erro
      console.error('Erro ao tentar buscar carro:', err);
      return res.status(500).json({ err: 'Erro ao tentar buscar carro' });
    }
  }

  // Método para registrar um novo carro no banco de dados
  async register(req, res) {
    // Define um esquema Yup para validar os dados recebidos na requisição
    const schema = Yup.object().shape({
      automaker: Yup.string().required(),
      engine: Yup.string().required(),
      year: Yup.number().required(),
      cylinder: Yup.number().required(),
      gear: Yup.number().required(),
      motor_oil: Yup.number().required(),
      oil_quantity: Yup.number().required(),
      oil_id: Yup.string().required(),
      oilFilter_id: Yup.string().required(),
    });

    // Extrai os dados relevantes do corpo da requisição
    const {
      automaker,
      engine,
      year,
      cylinder,
      gear,
      motor_oil,
      oil_quantity,
      oil_id,
      oilFilter_id,
    } = req.body;

    try {
      // Verifica se os dados recebidos são válidos de acordo com o esquema Yup
      if (!(await schema.isValid(req.body))) {
        return res
          .status(400)
          .json({ message: 'Preencha todos os campos corretamente.' });
      }

      // Cria um novo carro no banco de dados com base nos dados recebidos
      const newCar = await Car.create({
        automaker,
        engine,
        year,
        cylinder,
        gear,
        motor_oil,
        oil_quantity,
        oil: oil_id,
        oilFilter: oilFilter_id,
      });

      // Retorna o novo carro criado em formato JSON
      return res.status(200).json(newCar);
    } catch (err) {
      // Em caso de erro, loga o erro e retorna uma resposta de erro
      console.error('Erro ao tentar registrar carro:', err);
      return res.status(500).json({ err: 'Erro ao tentar registrar carro' });
    }
  }

  // Método para editar informações de um carro existente no banco de dados
  async edit(req, res) {
    // Obtém o ID do carro a ser editado a partir dos parâmetros da requisição
    const { id } = req.params;

    // Extrai os dados relevantes do corpo da requisição
    const {
      automaker,
      engine,
      year,
      cylinder,
      gear,
      motor_oil,
      oil_quantity,
      oil_id,
      oilFilter_id,
    } = req.body;

    try {
      // Verifica se o ID do carro foi fornecido
      if (!id) {
        return res.status(400).json({ message: 'ID do carro não fornecido.' });
      }

      // Atualiza as informações do carro no banco de dados com base no ID
      const updateCar = await Car.findByIdAndUpdate(id, {
        automaker,
        engine,
        year,
        cylinder,
        gear,
        motor_oil,
        oil_quantity,
        oil_id,
        oilFilter_id,
      });

      // Verifica se o carro foi encontrado e atualizado com sucesso
      if (!updateCar) {
        return res.status(404).json({ message: 'Carro não encontrado' });
      }

      // Retorna uma mensagem de sucesso em formato JSON
      return res
        .status(200)
        .json({ message: 'Informações do carro atualizado com sucesso.' });
    } catch (err) {
      // Em caso de erro, loga o erro e retorna uma resposta de erro
      console.error('Erro ao tentar editar carro:', err);
      return res.status(500).json({ err: 'Erro ao tentar editar carro' });
    }
  }

  // Método para excluir um carro do banco de dados com base no ID
  async delete(req, res) {
    // Obtém o ID do carro a ser excluído a partir dos parâmetros da requisição
    const { id } = req.params;

    try {
      // Verifica se o ID do carro foi fornecido
      if (!id) {
        return res.status(400).json({ message: 'ID do carro não fornecido.' });
      }

      // Exclui o carro do banco de dados com base no ID
      const deleteCar = await Car.findByIdAndDelete(id);

      // Verifica se o carro foi encontrado e excluído com sucesso
      if (!deleteCar) {
        return res.status(404).json({ message: 'Carro não encontrado.' });
      }

      // Retorna uma mensagem de sucesso em formato JSON
      return res.status(200).json({ message: 'Carro deletado com sucesso.' });
    } catch (err) {
      // Em caso de erro, loga o erro e retorna uma resposta de erro
      console.error('Erro ao tentar deletar carro:', err);
      return res.status(500).json({ err: 'Erro ao tentar deletar carro' });
    }
  }
}

// Exporta uma instância da classe CarController
export default new CarController();
