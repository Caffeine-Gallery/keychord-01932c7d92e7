import { backend } from "declarations/backend";

class GuitarGame {
    constructor() {
        this.notes = {
            'a': { frequency: 329.63, string: 0 }, // E
            's': { frequency: 440.00, string: 1 }, // A
            'd': { frequency: 587.33, string: 2 }, // D
            'f': { frequency: 783.99, string: 3 }, // G
            'g': { frequency: 987.77, string: 4 }, // B
            'h': { frequency: 1318.51, string: 5 }, // E2
            'j': { frequency: 440.00, string: 1 },
            'k': { frequency: 587.33, string: 2 },
            'l': { frequency: 783.99, string: 3 }
        };
        
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.score = 0;
        this.strings = document.querySelectorAll('.string');
        this.currentScoreElement = document.getElementById('current-score');
        this.highScoreElement = document.getElementById('highest-score');
        
        this.init();
    }

    async init() {
        this.bindEvents();
        await this.loadHighScore();
    }

    async loadHighScore() {
        try {
            const highScore = await backend.getHighScore();
            this.highScoreElement.textContent = highScore.toString();
        } catch (error) {
            console.error('Error loading high score:', error);
        }
    }

    playNote(frequency) {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        
        gainNode.gain.setValueAtTime(0.5, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 1);
        
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 1);
    }

    animateString(stringIndex) {
        const string = this.strings[stringIndex];
        string.classList.add('active', 'vibrating');
        setTimeout(() => {
            string.classList.remove('active', 'vibrating');
        }, 100);
    }

    async updateScore() {
        this.score += 10;
        this.currentScoreElement.textContent = this.score.toString();
        
        const currentHighScore = parseInt(this.highScoreElement.textContent);
        if (this.score > currentHighScore) {
            try {
                await backend.updateHighScore(this.score);
                this.highScoreElement.textContent = this.score.toString();
            } catch (error) {
                console.error('Error updating high score:', error);
            }
        }
    }

    bindEvents() {
        document.addEventListener('keydown', (event) => {
            const key = event.key.toLowerCase();
            if (this.notes[key]) {
                this.playNote(this.notes[key].frequency);
                this.animateString(this.notes[key].string);
                this.updateScore();
            }
        });
    }
}

// Initialize the game when the page loads
window.addEventListener('load', () => {
    new GuitarGame();
});
