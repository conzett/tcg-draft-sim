window.Test = {};

test("Picking a card", function () {
    'use strict';
    var testCard, testPack, testPlayer;

    testPlayer = new App.Player({
        human : true,
        pack : new App.Pack({
            cards : new App.Cards([new App.Card()]),
        })
    });

    testPack = testPlayer.GetPack();
    testCard = testPack.GetCards().first();
    testCard.Pick();

    equal(testPack.GetCards().length, 0, "We expect a card to be missing from the test pack" );
    equal(testPlayer.ListPicks().first(), testCard, "We expect the player's first pick to be the test card" );
});