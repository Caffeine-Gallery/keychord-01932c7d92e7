import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Array "mo:base/Array";
import Time "mo:base/Time";

actor GuitarHeroGame {
    stable var highScore : Nat = 0;
    stable var totalGamesPlayed : Nat = 0;
    stable var averageAccuracy : Nat = 0;

    public query func getHighScore() : async Nat {
        highScore
    };

    public func updateHighScore(newScore : Nat) : async Nat {
        totalGamesPlayed += 1;
        if (newScore > highScore) {
            highScore := newScore;
        };
        highScore
    };

    public query func getStats() : async {
        highScore : Nat;
        gamesPlayed : Nat;
        avgAccuracy : Nat;
    } {
        {
            highScore = highScore;
            gamesPlayed = totalGamesPlayed;
            avgAccuracy = averageAccuracy;
        }
    };

    public func updateStats(accuracy : Nat) : async () {
        let newTotalAccuracy = (averageAccuracy * totalGamesPlayed) + accuracy;
        averageAccuracy := newTotalAccuracy / (totalGamesPlayed + 1);
    };
}
