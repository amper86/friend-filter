const Model = require('../MVC/model');
const View = require('../MVC/view');

module.exports = class {
    constructor(api) {
        this.model = new Model(api);
        this.view = new View();

        this.init();
        this.moveButtonHandlers();
    }

    init() {
        this.friends();
        this.user();
    }

    async user() {
        const [userObject] = await this.model.user;
        const userHtml = this.view.render('user', userObject);

        document.querySelector('#user').innerHTML = userHtml;
        //console.log(userObject);
    }

    async friends() {
        const html = this.view.render('item', await this.model.friends);

        document.querySelector('#leftList').innerHTML = html;
        //console.log(await this.model.friends);
    }

    moveToColl(element, toColl) {
        if (element.closest('#leftList')) {
            toColl.appendChild(element);
        } else {
            toColl.appendChild(element);
        }
    }

    moveButtonHandlers() {
        const leftList = document.getElementById('leftList');
        const rightList = document.getElementById('rightList');

        leftList.addEventListener('click', (e) => {
            const listItem = e.target.closest('li');

            if (e.target.tagName === 'BUTTON') {
                this.moveToColl(listItem, rightList);
            }
        });

        rightList.addEventListener('click', (e) => {
            const listItem = e.target.closest('li');

            if(e.target.tagName === 'BUTTON') {
                this.moveToColl(listItem, leftList);
            }
        })
    }
};