const Model = require('../MVC/model');
const View = require('../MVC/view');

module.exports = class {
    constructor(api) {
        this.model = new Model(api);
        this.view = new View();

        this.init();
    }

    init() {
        this.friends();
    }

    async friends() {
        const html = this.view.render('item', await this.model.friends);

        document.querySelector('#oneList').innerHTML = html;
    }
    
};