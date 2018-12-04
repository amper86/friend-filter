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
        this.saveBtnHandler();
    }

    init() {
        this.friends();
        this.user();
    }

    saveBtnHandler() {
        const saveBtn = document.querySelector('#save');

        saveBtn.addEventListener('click', (e) => {
            let leftArr =[];
            let rightArr =[];
            const friendsId = document.querySelectorAll('.friend');
            e.preventDefault();
            for (let friend of friendsId) {
                if (friend.closest('#leftList')) {
                    leftArr.push(friend.dataset.id);
                } else {
                    rightArr.push(friend.dataset.id);
                }
            }
            this.saveLocalStorage(leftArr, rightArr)
        })
    }

    saveLocalStorage(leftArr, rightArr) {
        let storage = localStorage;
        let saveObj ={};

        saveObj.left = leftArr;
        saveObj.right = rightArr;
        storage.data = JSON.stringify(saveObj);
    }

    async user() {
        const [userObject] = await this.model.user;
        const userHtml = this.view.render('user', userObject);

        document.querySelector('#user').innerHTML = userHtml;
    }

    async friends() {
        const storage = localStorage;
        if (!storage.data) {
            const html = this.view.render('item', await this.model.friends);

            document.querySelector('#leftList').innerHTML = html;
        } else {
            let vkData = await this.model.friends;
            let storageData = JSON.parse(storage.data);
            let objLeft = {count: 0, items: []};
            let objRight = {count: 0, items: []};

            forVk: for (let i = 0, vkFriends = vkData.items; i < vkFriends.length; i++) {
                let vkId = vkFriends[i].id;

                for (let x = 0, storageDataRight = storageData.right; x < storageDataRight.length; x++) {
                    let rightFriend = storageDataRight[x];

                    if (vkId === Number(rightFriend)) {
                        objRight.items.push(vkFriends[i]);
                        objRight.count = objRight.items.length;
                        continue forVk;
                    }
                }
                objLeft.items.push(vkFriends[i]);
                objLeft.count = objLeft.items.length;
            }
            let htmlLeft = this.view.render('item', objLeft);
            let htmlRight = this.view.render('item', objRight);

            document.querySelector('#leftList').innerHTML = htmlLeft;
            document.querySelector('#rightList').innerHTML = htmlRight;
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
            });

            coll.addEventListener('dragover', (e) => {
                e.preventDefault();
            });

            coll.addEventListener('drop', (e) => {
                if (currentDrag) {
                    e.preventDefault();
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