class HomeController {
  index(req, res) {
    const teste = 'fire, 1.0, 2013';

    // Use uma expressão regular que considere vírgulas, espaços ou hífens como delimitadores
    const parts = teste.split(/\s*[,|-]\s*|\s+/);

    // Defina as palavras-chave que você está procurando
    const palavrasChave = ['fire', '1.0', '2013', '2.0', '2020'];

    // Objeto para armazenar as informações analisadas
    const carInfo = {};

    // Iterar sobre as partes e verificar se cada parte contém uma palavra-chave
    // eslint-disable-next-line no-restricted-syntax
    for (const palavraChave of palavrasChave) {
      const parteEncontrada = parts.find(part => part.includes(palavraChave));

      if (parteEncontrada) {
        // Adicione a parte encontrada ao objeto de informações do carro
        carInfo[palavraChave] = parteEncontrada;
      }
    }

    console.log(carInfo);
  }
}

export default new HomeController();
