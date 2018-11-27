import '../scss/main.scss';
const VK = require('./modules/api.vk');
const Controller = require('./MVC/controller');

const apiVK = new VK(6762734, 2);
const controller = new Controller(apiVK);




