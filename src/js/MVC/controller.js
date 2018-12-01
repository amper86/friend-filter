const Model = require('../MVC/model');
const View = require('../MVC/view');

module.exports = class {
    constructor(api) {
        this.model = new Model(api);
        this.view = new View();

        this.init();
        this.moveButtonHandlers();
        this.makeDnD();
        this.filterFriend();
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
        })
    }

    filterFriend() {
        //обрабатываем кнопки и вызываем метод обработки проверки друзей
        const leftBtn = document.getElementById('buttonLeft');
        const rightBtn = document.getElementById('buttonRight');
        const btnArray = [leftBtn, rightBtn];

        btnArray.forEach(btn => {
            btn.addEventListener('click', (e) => {
                let currentInput = e.target.closest('button').nextElementSibling;
                let inputValue = currentInput.value.toLowerCase();

                e.preventDefault();
                if (e.target.closest('button').id === 'buttonLeft') {
                    let friendName = document.querySelectorAll('#leftList .friend__name');

                    this.checkFriends(friendName, inputValue)
                } else {
                    let friendName = document.querySelectorAll('#rightList .friend__name');

                    this.checkFriends(friendName, inputValue)
                }
            })
        });
    }

    checkFriends(friendName, inputValue) {
        //проверяем каждую карточку друга на совпадении в методе isMatching, убираем или оставляем карточку

        for (let friend of friendName) {
            let name = friend.textContent.toLowerCase();
            let arrName = name.split(' ');
            let li = friend.closest('li');

            if (this.isMatching(arrName, inputValue)) {
                li.style.display = 'block';
            } else {
                li.style.display = 'none';
            }
        }
    }

    isMatching(arrName, inputValue) {
        //если true то совпадает значение по имени или фамилии
        let flag = false;

        if (~arrName[0].indexOf(inputValue) || ~arrName[1].indexOf(inputValue)) {
            flag = true;
        }
        return flag
    }
};