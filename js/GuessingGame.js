function generateWinningNumber() {
    return Math.floor((Math.random() * 100) + 1);
}

function shuffle(array) {
    var m = array.length, t, i;
  
    // While there remain elements to shuffle…
    while (m) {
  
      // Pick a remaining element…
      i = Math.floor(Math.random() * m--);
  
      // And swap it with the current element.
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }
  
    return array;
}

function Game() {
    this.pastGuesses = [];
    this.playersGuess = null;
    this.winningNumber = generateWinningNumber();
}

Game.prototype.difference = function() {
    return Math.abs(this.playersGuess - this.winningNumber);
}

Game.prototype.isLower = function() {
    return this.playersGuess < this.winningNumber;
}

Game.prototype.playersGuessSubmission = function(num) {
    if (typeof num !== 'number' || num < 1 || num > 100) {
        throw "That is an invalid guess.";
    }
    this.playersGuess = num;
    return this.checkGuess();
}

Game.prototype.checkGuess = function() {
    if (this.playersGuess === this.winningNumber) {
        return "You Win!";
    }
    else {
        if (!!~this.pastGuesses.indexOf(this.playersGuess)) {
            return "You have already guessed that number.";
        }
        else {
            this.pastGuesses.push(this.playersGuess);
            if (this.pastGuesses.length === 5) {
                return "You Lose.";
            }
            else {
                if (this.difference() < 10) {
                    return "You're burning up!";
                }
                else if (this.difference() < 25) {
                    return "You're lukewarm.";
                } 
                else if (this.difference() < 50) {
                    return "You're a bit chilly.";
                } 
                else {
                    return "You're ice cold!";
                } 
            }
        }
    }
}

Game.prototype.provideHint = function() {
    var hintArray = [this.winningNumber,
    generateWinningNumber(),
    generateWinningNumber()];
    return shuffle(hintArray); 
}


function newGame() {
    return new Game;
}

$(document).ready(function() {
    var gameInstance = newGame();
    var guessEntry = $('li').first();

    function gameplay(e) {
        var guess = Number($('#player-input').val());
        $('#player-input').val("");
        $('#player-input').css("autofocus autofocus");
        
        var output = gameInstance.playersGuessSubmission(guess);
    
        if (output === "You have already guessed that number.") {
            $('h1').text("Guess again!");
            $('h3').text(output);
        }
        else{
            guessEntry.text(guess);
            guessEntry = guessEntry.next();
            $('h3').text(output + " - Guess " + (gameInstance.isLower() ? "higher." : "lower."));
        
            if (output === "You Win!" || output === "You Lose.") {
                $('h1').text(output);
                $('h2').text("Press the Reset button to play again");
                $('h3').text("Well done, champ!");
                $('#submit').off(); 
                $('#player-input').off();
            }
        }
        
    
    }

    $('#submit').click(gameplay); 

    $('#player-input').keydown(function(e) {
        if (Number(e.which) === 13) {
            gameplay();
        }
    });
    
    $('#hint').one('click', function(e) {
        var hints = gameInstance.provideHint().join("-");
        $('#title').append('<p>Hints: ' + hints + '</p>');      
    });

    $('#reset').click(function(e) {
        location.reload();
    });
});