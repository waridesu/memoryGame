const startBtn = document.querySelector('.start-btn');
const resetBtn = document.querySelector('.reset-btn');
const pageWrapper = document.querySelector('.match__grid');
const msgContainer = document.querySelector('.match__navigation-message');
const root = document.querySelector(':root');

class MatchGrid {
    toggleCardCb = this._toggleCard.bind(this)
    _chosenCardsIds = [];
    _isPaused;
    _outCardsCb = this._outHandler.bind(this)
    _hoverCardsCb = this._hoverCardHelper.bind(this)

    constructor(width, height, time, theme) {
        this.width = width
        this.heigth = height
        this.time = time
        this.theme = theme
    }

    startTimer() {
        let time = this.time
        msgContainer.classList.remove('is-win','is-lose')
        anime({
            targets: msgContainer,
            translateY: 0,
            scale: 1,
        })
        msgContainer.innerHTML = `time: <span class="counter">${time}</span> seconds remaining!`;
        const counter = msgContainer.querySelector('.counter')
        const interval = setInterval(() => {
            if (!this._isPaused) {
                time = --time
                if (time > 0) {

                    counter.innerHTML = time
                } else {
                    msgContainer.innerHTML = 'time out';
                    anime({
                        targets: msgContainer,
                        translateY: {
                            value: ['0', '30vh'],
                        },
                        scale: 4,
                        easing: 'linear',
                        duration: 3000,
                    })
                    this.showMessage('time out')
                    this._removeWrapperListener();
                    clearInterval(interval);
                }
            }
        }, 1000);
    }
    showMessage(message) {
        msgContainer.innerHTML = message;
        anime({
            targets: msgContainer,
            background: 'red'/*message === 'you won' ? '--isSolved' : '--isUnsolved'*/,
            translateY: {
                value: ['0', '30vh'],
            },
            scale: 4,
            easing: 'linear',
            duration: 3000,
        })
        msgContainer.classList.add(message === 'you won' ? 'is-win': 'is-lose')
        this._isPaused = true;
    }
    initiateBoard() {
        this._preparingData().forEach(el => {
            const activity = document.createElement('div')
            activity.classList.add('match__grid-cell')
            activity.setAttribute('data-id', el);
            pageWrapper.appendChild(activity);
        })

        pageWrapper.style.gridTemplate = `repeat(${this.heigth},2fr)/repeat(${this.width}, 2fr)`;
        this._addingWrapperListener();
        this.startTimer();
    }

    initStyles() {
        root.style.setProperty('--isSolved', this.theme[0]);
        root.style.setProperty('--isUnsolved', this.theme[1]);
        root.style.setProperty('--changed-font', this.theme[2]);
    }
    _addingWrapperListener() {
        pageWrapper.addEventListener('click', this.toggleCardCb)
        pageWrapper.addEventListener('mouseover', this._hoverCardsCb)
        pageWrapper.addEventListener('mouseout', this._hoverCardsCb)
        pageWrapper.addEventListener('mouseleave', this._outCardsCb)
        pageWrapper.addEventListener('mouseenter', this._outCardsCb)
    }

    _removeWrapperListener() {
        pageWrapper.removeEventListener('click', this.toggleCardCb)
        pageWrapper.removeEventListener('mouseover', this._hoverCardsCb)
        pageWrapper.removeEventListener('mouseout', this._hoverCardsCb)
        pageWrapper.removeEventListener('mouseleave', this._outCardsCb)
        pageWrapper.removeEventListener('mouseenter', this._outCardsCb)
    }

    _preparingData() {
        let renderMatrix = new Array(this.width * this.heigth)
            .fill(null)
            .map((_, i) => ++i);
        renderMatrix = [...renderMatrix].slice(0, renderMatrix.length / 2)
            .reduce((res, cur) => [...res, cur, cur], [])
            .sort(() => Math.random() - 0.5);
        return renderMatrix;
    }

    _toggleCard(event) {
            if (event.target.classList.contains('match__grid-cell') && this._chosenCardsIds.length !== 2) {
                const cardId = event.target.getAttribute('data-id')
                const elIndex = [].indexOf.call(event.target.parentElement.children, event.target);
                event.target.innerHTML = cardId;
                const isNotInArray = (this._chosenCardsIds.length === 0) || this._chosenCardsIds.some(({index}) => index !== elIndex)
                if (isNotInArray) {
                    this._chosenCardsIds.push({id: cardId, index: elIndex})
                }
                if (this._chosenCardsIds.length === 2) {
                    setTimeout(this._checkForMatch.bind(this), 200)
                }
            }
    }

    _checkForMatch() {
        const isMatchWithoutClass = (el) => el.innerHTML === this._chosenCardsIds[0].id && el.innerHTML === this._chosenCardsIds[1].id && !el.classList.contains('is-match')
        const cellsArray = document.querySelectorAll('.match__grid-cell');
        cellsArray.forEach(el => {
            if (isMatchWithoutClass(el)) {
                el.classList.add('is-match');
            }
            el.innerHTML = el.classList.contains('is-match') ? el.innerHTML : '';
        })
        this._chosenCardsIds = []
        if([...cellsArray].every(el => el.classList.contains('is-match'))) {
            this.showMessage('you won');
        }
    }

    _outHandler(event) {
        this._isPaused = event.type === 'mouseleave';
    }

    _hoverCardHelper(event) {
        if (event.target.classList.contains('match__grid-cell')) {
            anime({
                targets: event.target,
                scale: event.type === 'mouseover' ? 1.1 : 1,
                borderRadius: event.type === 'mouseover' ? '10px' :'0',
            })
        }
    }
}

const newGame = new MatchGrid(5, 3, 30, ['#7e9a9a', '#f6d8ac', 'Cursive']);

newGame.initStyles();

startBtn.addEventListener('click', startHandler);
resetBtn.addEventListener('click', resetHandler);

function resetHandler() {
    pageWrapper.replaceChildren();
    pageWrapper.removeEventListener('click', newGame.toggleCardCb)
    newGame.initiateBoard();
}

function startHandler(event) {
    newGame.initiateBoard();
    event.target.removeEventListener('click', startHandler);
    startBtn.remove();
}
