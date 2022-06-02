const startBtn = document.querySelector('.start-btn');

class MatchGrid {
    pageWrapper = document.querySelector('.match__grid');
    chosenCardsIds = [];
    match;
    constructor(width, height, number) {
        this.width = width
        this.heigth = height
        this.number = number
    }
    initiateBoard () {
        const subMatrix = new Array(this.width).fill(null).map(() => Math.floor(Math.random() * (this.number - 1) + 1));
        console.log(subMatrix);
        console.log(this.number);
        console.log(Math.floor(Math.random() * (this.number - 1) + 1));
        const renderMatrix = new Array(this.heigth).fill(subMatrix);

        renderMatrix.forEach(el => {
            const wrapper = document.createElement('div');
            wrapper.classList.add('match__sub-grid')
            el.forEach(item => {
                const activity = document.createElement('div')
                activity.classList.add('match__grid-cell')
                activity.setAttribute('data-id', item);
                wrapper.append(activity)
            })
            this.pageWrapper.appendChild(wrapper)
        })
        this.pageWrapper.addEventListener('click', this.toggleCard.bind(this))
    }

    toggleCard(event) {
        if (this.chosenCardsIds.length !== 2) {
            if (event.target.classList.contains('match__grid-cell')) {
                const cardId = event.target.getAttribute('data-id')
                event.target.innerHTML = cardId;
                this.chosenCardsIds.push(cardId)
                if (this.chosenCardsIds.length === 2) {
                    setTimeout(this.checkForMatch.bind(this), 100)
                }
            }
        }
    }

    checkForMatch() {
            document.querySelectorAll('.match__grid-cell').forEach(el => {
                if (el.innerHTML === this.chosenCardsIds[0] && el.innerHTML === this.chosenCardsIds[1] && !el.classList.contains('is-match')) {
                    ++this.match;
                    el.classList.add('is-match');
                }
                el.innerHTML = el.classList.contains('is-match') ? el.innerHTML : '';
            })
        this.chosenCardsIds = []
    }
}

const newGame = new MatchGrid(5, 4, 5);

startBtn.addEventListener('click', startHandler);

function startHandler (event) {
    newGame.initiateBoard();
    event.target.removeEventListener('click', startHandler, false);
    startBtn.remove();
}
