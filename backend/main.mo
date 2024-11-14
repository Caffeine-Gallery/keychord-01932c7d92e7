import Int "mo:base/Int";
import Nat "mo:base/Nat";

actor GuitarGame {
    stable var highScore : Nat = 0;

    // Get the current high score
    public query func getHighScore() : async Nat {
        highScore
    };

    // Update the high score if the new score is higher
    public func updateHighScore(newScore : Nat) : async Nat {
        if (newScore > highScore) {
            highScore := newScore;
        };
        highScore
    };
}
