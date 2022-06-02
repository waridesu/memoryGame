const startBtn = document.querySelector('.start-btn');
const resetBtn = document.querySelector('.reset-btn');
const pageWrapper = document.querySelector('.match__grid');
const msgContainer = document.querySelector('.match__navigation-message');

class MatchGrid {
    chosenCardsIds = [];
    match;

    constructor(width, height, time) {
        this.width = width
        this.heigth = height
        this.time = time
        this.toggleCardCallBack = this.toggleCard.bind(this)
    }

    startTimer() {
        let time = this.time
        msgContainer.innerHTML = `time: <span class="counter">${time}</span> seconds remaining!`
        const interval = setInterval( () => {
            time = --time
            if (time > 0) {
                if (msgContainer.querySelector('.counter')) {
                    msgContainer.querySelector('.counter').innerHTML = time
                }
            } else {
                msgContainer.innerHTML = 'time out';
                pageWrapper.removeEventListener('click', this.toggleCardCallBack)
                clearInterval(interval);
            } }, 1000);
    }

    initiateBoard() {
        let renderMatrix = new Array(this.width * this.heigth)
            .fill(null)
            .map((_, i) => ++i);
        renderMatrix = [...renderMatrix].slice(0, renderMatrix.length / 2)
            .reduce((res, cur) => [...res, cur, cur], [])
            .sort(() => Math.random() - 0.5);
        renderMatrix.forEach(el => {
            const activity = document.createElement('div')
            activity.classList.add('match__grid-cell')
            activity.setAttribute('data-id', el);
            pageWrapper.appendChild(activity);
        })
        pageWrapper.style.gridTemplate = `repeat(${this.heigth}, 1fr)/repeat(${this.width}, 1fr)`;
        pageWrapper.addEventListener('click', this.toggleCardCallBack)
        this.startTimer();
    }

    toggleCard(event) {
        if (this.chosenCardsIds.length !== 2) {
            if (event.target.classList.contains('match__grid-cell')) {
                const cardId = event.target.getAttribute('data-id')
                const elIndex = [].indexOf.call(event.target.parentElement.children, event.target);
                event.target.innerHTML = cardId;
                if ((this.chosenCardsIds.length === 0) || this.chosenCardsIds.some(({index}) => index !== elIndex)) {
                    this.chosenCardsIds.push({id: cardId, index: elIndex})
                }
                if (this.chosenCardsIds.length === 2) {
                    setTimeout(this.checkForMatch.bind(this), 200)
                }
            }
        }
    }

    checkForMatch() {
        console.log(this.chosenCardsIds[0].id, this.chosenCardsIds[1].id);
        document.querySelectorAll('.match__grid-cell').forEach(el => {
            if (el.innerHTML === this.chosenCardsIds[0].id && el.innerHTML === this.chosenCardsIds[1].id && !el.classList.contains('is-match')) {
                ++this.match;
                el.classList.add('is-match');
            }
            el.innerHTML = el.classList.contains('is-match') ? el.innerHTML : '';
        })
        this.chosenCardsIds = []
    }
}

const newGame = new MatchGrid(5, 3, 5);

startBtn.addEventListener('click', startHandler);
resetBtn.addEventListener('click', resetHandler);

function resetHandler() {
    pageWrapper.replaceChildren();
    pageWrapper.removeEventListener('click', newGame.toggleCardCallBack)
    newGame.initiateBoard();
}

function startHandler(event) {
    newGame.initiateBoard();
    event.target.removeEventListener('click', startHandler);
    startBtn.remove();
}
