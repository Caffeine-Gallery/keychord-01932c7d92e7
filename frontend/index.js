import { backend } from "declarations/backend";

class GuitarHeroGame {
    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.score = 0;
        this.multiplier = 1;
        this.accuracy = 100;
        this.notesContainer = document.getElementById('notes-container');
        this.currentScoreElement = document.getElementById('current-score');
        this.multiplierElement = document.getElementById('multiplier');
        this.accuracyElement = document.getElementById('accuracy');
        this.highScoreElement = document.getElementById('high-score');
        this.startButton = document.getElementById('start-game');
        
        this.notes = {
            'a': { frequency: 261.63, note: 'C4' }, // C
            's': { frequency: 293.66, note: 'D4' }, // D
            'd': { frequency: 329.63, note: 'E4' }, // E
            'f': { frequency: 349.23, note: 'F4' }, // F
            'g': { frequency: 392.00, note: 'G4' }, // G
            'h': { frequency: 440.00, note: 'A4' }, // A
            'j': { frequency: 493.88, note: 'B4' }  // B
        };

        this.twinkleStar = [
            { note: 'C4', key: 'a', time: 0 },
            { note: 'C4', key: 'a', time: 1000 },
            { note: 'G4', key: 'g', time: 2000 },
            { note: 'G4', key: 'g', time: 3000 },
            { note: 'A4', key: 'h', time: 4000 },
            { note: 'A4', key: 'h', time: 5000 },
            { note: 'G4', key: 'g', time: 6000 },
            { note: 'F4', key: 'f', time: 8000 },
            { note: 'F4', key: 'f', time: 9000 },
            { note: 'E4', key: 'd', time: 10000 },
            { note: 'E4', key: 'd', time: 11000 },
            { note: 'D4', key: 's', time: 12000 },
            { note: 'D4', key: 's', time: 13000 },
            { note: 'C4', key: 'a', time: 14000 }
        ];

        this.activeNotes = new Set();
        this.init();
    }

    async init() {
        await this.loadHighScore();
        this.bindEvents();
    }

    async loadHighScore() {
        try {
            const highScore = await backend.getHighScore();
            this.highScoreElement.textContent = `High Score: ${highScore}`;
        } catch (error) {
            console.error('Error loading high score:', error);
        }
    }

    bindEvents() {
        this.startButton.addEventListener('click', () => this.startGame());
        document.addEventListener('keydown', (event) => this.handleKeyPress(event));
    }

    startGame() {
        this.score = 0;
        this.multiplier = 1;
        this.accuracy = 100;
        this.activeNotes.clear();
        this.notesContainer.innerHTML = '';
        this.updateDisplay();
        this.startButton.disabled = true;
        
        this.twinkleStar.forEach(noteData => {
            setTimeout(() => this.spawnNote(noteData), noteData.time);
        });
    }

    spawnNote(noteData) {
        const noteElement = document.createElement('div');
        noteElement.className = 'note';
        noteElement.dataset.key = noteData.key;
        noteElement.style.top = '-20px';
        this.notesContainer.appendChild(noteElement);
        
        this.activeNotes.add({
            element: noteElement,
            key: noteData.key,
            frequency: this.notes[noteData.key].frequency,
            startTime: Date.now()
        });

        this.animateNote(noteElement);
    }

    animateNote(noteElement) {
        noteElement.style.top = '600px';
        setTimeout(() => {
            if (this.notesContainer.contains(noteElement)) {
                noteElement.remove();
                this.missNote();
            }
        }, 2000);
    }

    handleKeyPress(event) {
        const key = event.key.toLowerCase();
        if (!this.notes[key]) return;

        const currentTime = Date.now();
        let hitNote = false;

        for (const note of this.activeNotes) {
            if (note.key === key) {
                const timeDiff = Math.abs(currentTime - note.startTime - 1500);
                if (timeDiff < 200) {
                    this.hitNote(timeDiff, note);
                    hitNote = true;
                    break;
                }
            }
        }

        if (!hitNote) {
            this.playNote(this.notes[key].frequency);
        }
    }

    hitNote(timeDiff, note) {
        note.element.remove();
        this.activeNotes.delete(note);
        
        let points = 0;
        if (timeDiff < 50) {
            points = 100;
            this.multiplier++;
        } else if (timeDiff < 100) {
            points = 50;
        } else {
            points = 25;
            this.multiplier = Math.max(1, this.multiplier - 1);
        }

        this.score += points * this.multiplier;
        this.playNote(note.frequency);
        this.updateDisplay();
    }

    missNote() {
        this.multiplier = 1;
        this.accuracy = Math.max(0, this.accuracy - 5);
        this.updateDisplay();
    }

    playNote(frequency) {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        
        gainNode.gain.setValueAtTime(0.5, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.5);
        
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.5);
    }

    updateDisplay() {
        this.currentScoreElement.textContent = `Score: ${this.score}`;
        this.multiplierElement.textContent = `Multiplier: x${this.multiplier}`;
        this.accuracyElement.textContent = `Accuracy: ${this.accuracy}%`;
        
        if (this.score > parseInt(this.highScoreElement.textContent.split(': ')[1])) {
            backend.updateHighScore(this.score);
            this.highScoreElement.textContent = `High Score: ${this.score}`;
        }
    }
}

window.addEventListener('load', () => {
    new GuitarHeroGame();
});
