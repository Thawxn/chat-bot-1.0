class HomeController {
  index(req, res) {
    res.send('Hello Word');
  }
}

export default new HomeController();
