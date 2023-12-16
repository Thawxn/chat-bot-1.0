import * as Yup from 'yup';
import Car from '../models/Car.js';

class CarController {
  async index(req, res) {
    try {
      const response = await Car.find();
      return res.status(200).json(response);
    } catch (err) {
      console.error('Erro ao buscar carros:', err);
      return res.status(500).json({ err: 'erro ao buscar carros' });
    }
  }

  async indexOne(req, res) {
    const { automaker, engine } = req.params;

    try {
      const searchQuery = {};

      if (automaker) {
        searchQuery.automaker = automaker;
      }

      if (engine) {
        searchQuery.engine = engine;
      }

      const searchResults = await Car.find(searchQuery);

      if (searchResults.length > 0) {
        return res.status(200).json(searchResults);
      }

      return res.status(404).json({ message: 'Nenhum resultado encontrado.' });
    } catch (err) {
      console.error('Erro ao tentar buscar carro:', err);
      return res.status(500).json({ err: 'Erro ao tentar buscar carro' });
    }
  }

  async register(req, res) {
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
      if (!(await schema.isValid(req.body))) {
        return res
          .status(400)
          .json({ message: 'Preencha todos os campos corretamente.' });
      }

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

      return res.status(200).json(newCar);
    } catch (err) {
      console.error('Erro ao tentar registrar carro:', err);
      return res.status(500).json({ err: 'Erro ao tentar registrar carro' });
    }
  }

  async edit(req, res) {
    const { id } = req.params;
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
      if (!id) {
        return res.status(400).json({ message: 'ID do carro não fornecido.' });
      }

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

      if (!updateCar) {
        return res.status(404).json({ message: 'Carro não encontrado' });
      }

      return res
        .status(200)
        .json({ message: 'Informações do carro atualizado com sucesso.' });
    } catch (err) {
      console.error('Erro ao tentar editar carro:', err);
      return res.status(500).json({ err: 'Erro ao tentar editar carro' });
    }
  }

  async delete(req, res) {
    const { id } = req.params;

    try {
      if (!id) {
        return res.status(400).json({ message: 'ID do carro não fornecido.' });
      }

      const deleteCar = await Car.findByIdAndDelete(id);

      if (!deleteCar) {
        return res.status(404).json({ message: 'Carro não encontrado.' });
      }

      return res.status(200).json({ message: 'Carro deletado com sucesso.' });
    } catch (err) {
      console.error('Erro ao tentar deletar carro:', err);
      return res.status(500).json({ err: 'Erro ao tentar deletar carro' });
    }
  }
}

export default new CarController();
