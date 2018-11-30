const Model = require('../MVC/model');
const View = require('../MVC/view');

module.exports = class {
    constructor(api) {
        this.model = new Model(api);
        this.view = new View();

        this.init();
        this.moveButtonHandlers();
        this.makeDnD();
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

    moveButtonHandlers() {
        const leftList = document.getElementById('leftList');
        const rightList = document.getElementById('rightList');
        //ToDO: подумать как объединить разработчики как в DnD

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

    moveToColl(element, toColl) {
        if (element.closest('#leftList')) {
            toColl.appendChild(element);
        } else {
            toColl.appendChild(element);
        }
    }

    makeDnD() {
        const leftList = document.getElementById('leftList');
        const rightList = document.getElementById('rightList');
        const collums = [leftList, rightList];
        let currentDrag;
        //todo: можно сделать перетаскивание, через setDragImage будет видна картинка при перетаскивании

        collums.forEach(coll => {
            coll.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/html', 'dragstart');
                currentDrag = {
                    source: coll,
                    node: e.target.closest('.friends__item')
                };
                //console.log(e.target.closest('.friends__item'));
            });

            coll.addEventListener('dragover', (e) => {
                e.preventDefault();
            });

            coll.addEventListener('drop', (e) => {
                if (currentDrag) {
                    //e.preventDefault();
                    e.stopPropagation();

                    //console.log(currentDrag.source);
                    //console.log(coll);

                    if (currentDrag.source !== coll) {
                        coll.appendChild(currentDrag.node);
                    }

                    currentDrag = null;
                }
            });
            //todo: сделать фильтр
        })

    }
};