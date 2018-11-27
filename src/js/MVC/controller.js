const Model = require('../MVC/model');
const View = require('../MVC/view');

module.exports = class {
    constructor(api) {
        this.model = new Model(api);
        this.view = new View();

        this.init();
        this.addButtonHandler();
    }

    init() {
        this.friends();
    }

    async friends() {
        const html = this.view.render('item', await this.model.friends);

        document.querySelector('#leftList').innerHTML = html;
        console.log(await this.model.friends);
    }

    addButtonHandler() {
        //ToDo: сделать одну функцию или метод для перемещеня элемента
        const leftList = document.getElementById('leftList');
        const rightList = document.getElementById('rightList');

        leftList.addEventListener('click', (e) => {
            const listItem = e.target.closest('li');

            console.log(e);

            if(e.target.tagName === 'BUTTON') {
                rightList.appendChild(listItem);
            }
        });

        rightList.addEventListener('click', (e) => {
            const listItem = e.target.closest('li');

            if(e.target.tagName === 'BUTTON') {
                leftList.appendChild(listItem);
            }
        })
    }
};