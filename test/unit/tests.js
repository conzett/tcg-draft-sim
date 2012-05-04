window.Test = {};

Test.TestPack = App.Pack.extend({
    initialize: function () {
        'use strict';
        while (this.get('cards').length < 15) {
            this.get('cards').push(new App.Card());
        }
    }
});

module("Draft model");

test("First pack: packs should be passed left", function () {
    'use strict';
    var player1 = new App.Player({ packs : new App.Packs([new Test.TestPack()])}),
        player2 = new App.Player({ packs : new App.Packs([new Test.TestPack()])}),
        player3 = new App.Player({ packs : new App.Packs([new Test.TestPack()])}),
        player4 = new App.Player({ packs : new App.Packs([new Test.TestPack()])}),
        draft,
        cid1,
        cid2,
        cid3,
        cid4;

    cid1 = player1.getCurrentPack().cid;
    cid2 = player2.getCurrentPack().cid;
    cid3 = player3.getCurrentPack().cid;
    cid4 = player4.getCurrentPack().cid;

    draft = new App.Draft({
        players : new App.Players([player1, player2, player3, player4])
    });

    draft.passPacks();
    equal(draft.getPlayer(0).getCurrentPack().cid, cid2, "Expect first player to have player two's pack after passing left");
    equal(draft.getPlayer(1).getCurrentPack().cid, cid3, "Expect second player to have player three's pack after passing left");
    equal(draft.getPlayer(2).getCurrentPack().cid, cid4, "Expect third player to have player fours's pack after passing left");
    equal(draft.getPlayer(3).getCurrentPack().cid, cid1, "Expect fourth player to have player one's pack after passing left");
});

test("Second pack: packs should be passed right", function () {
    'use strict';
    var player1 = new App.Player({ packs : new App.Packs([new Test.TestPack()])}),
        player2 = new App.Player({ packs : new App.Packs([new Test.TestPack()])}),
        player3 = new App.Player({ packs : new App.Packs([new Test.TestPack()])}),
        player4 = new App.Player({ packs : new App.Packs([new Test.TestPack()])}),
        draft,
        cid1,
        cid2,
        cid3,
        cid4;

    cid1 = player1.getCurrentPack().cid;
    cid2 = player2.getCurrentPack().cid;
    cid3 = player3.getCurrentPack().cid;
    cid4 = player4.getCurrentPack().cid;

    draft = new App.Draft({
        players : new App.Players([player1, player2, player3, player4])
    });

    draft.set('round', 2);

    draft.passPacks();
    equal(draft.getPlayer(0).getCurrentPack().cid, cid4, "Expect first player to have player four's pack after passing right");
    equal(draft.getPlayer(1).getCurrentPack().cid, cid1, "Expect second player to have player ones's pack after passing right");
    equal(draft.getPlayer(2).getCurrentPack().cid, cid2, "Expect third player to have player two's pack after passing right");
    equal(draft.getPlayer(3).getCurrentPack().cid, cid3, "Expect fourth player to have player three's pack after passing right");
});

test("The correct round number being set", function () {
    'use strict';
    var player1 = new App.Player({ packs : new App.Packs([new App.Pack(), new Test.TestPack()])}),
        player2 = new App.Player({ packs : new App.Packs([new App.Pack(), new Test.TestPack()])}),
        draft

    draft = new App.Draft({
        players : new App.Players([player1, player2])
    });

    equal(draft.getRound(), 1, "Expect the initial round to be 1");
    draft.passPacks();
    equal(draft.getRound(), 2, "After passing packs once, the round should be 2");
});

test("Check to see if all active packs are empty", function () {
    'use strict';
    var player1 = new App.Player({
            packs : new App.Packs([
                new Test.TestPack()
            ])
        }),
        player2 = new App.Player({
            packs : new App.Packs([
                new App.Pack()
            ])
        }), draft;

    draft = new App.Draft({
        players : new App.Players([player1, player2])
    });

    ok(!draft.allActivePacksEmpty(), "Expect all the active packs to not be empty");
    draft.getPlayer(0).set('packs', new App.Packs([new App.Pack()]));
    ok(draft.allActivePacksEmpty(), "Expect all the active packs to be empty");
});

test("The next pack is opened when an empty one is passed", function () {
    'use strict';
    var pack1 = new App.Pack(),
        pack2 = new Test.TestPack(),
        pack3 = new App.Pack(),
        pack4 = new Test.TestPack(),
        player1,
        player2,
        draft,
        cid1,
        cid2;

    cid1 = pack2.cid;
    cid2 = pack4.cid;

    player1 = new App.Player({ packs : new App.Packs([pack1, pack2])});
    player2 = new App.Player({ packs : new App.Packs([pack3, pack4])});

    draft = new App.Draft({
        players : new App.Players([player1, player2])
    });

    draft.passPacks();
    equal(player1.getCurrentPack().cid, cid1, "Expect player one's new active pack to have the ID of the next pack in the queue after passing an empty pack");
    equal(player2.getCurrentPack().cid, cid2, "Expect player two's new active pack to have the ID of the next pack in the queue after passing an empty pack");
});

module("StandardDraft model", {
    setup: function () {
        'use strict';
        this.draft = new App.StandardDraft();
    }
});

test("Initialization", function () {
    'use strict';
    equal(this.draft.listBotPlayers().length, 7, "Expect 7 bot players in a standard draft");
    equal(this.draft.listHumanPlayers().length, 1, "Expect 1 human player");
});

module("Pack model");

test("Removing a card", function () {
    'use strict';
    var pack = new Test.TestPack(), cid, card;
    cid = pack.listCards().at(0).cid;
    card = pack.removeCard(cid);
    equal(pack.listCards().length, 14, "Expect 14 cards in the test card pack after one removal");
    equal(card.cid, cid, "Expect the ID of the returned card to match the card is removed");
});

test("Is a pack empty", function () {
    'use strict';
    var fullPack = new Test.TestPack(), emptyPack = new App.Pack();
    ok(!fullPack.empty(), "empty returns false for a full pack");
    ok(emptyPack.empty(), "empty returns true for an empty pack");
});

module("Player model");

test("Initialization", function () {
    'use strict';
    var pack1 = new Test.TestPack(),
        pack2 = new Test.TestPack(),
        pack3 = new Test.TestPack(),
        player;

    player = new App.Player({
        packs : new App.Packs([pack1, pack2, pack3])
    });

	equal(player.getCurrentPack().cid, pack1.cid, "Expect currentPack to be the first back in the packs array");
	equal(player.listUnopenedPacks().length, 2, "Expect 2 unopened packs");
});

test("Checking for active pack being empty", function () {
    'use strict';
    var player = new App.Player({
        packs : new App.Packs([new App.Pack(), new Test.TestPack()])
    })

    ok(player.activePackEmpty(), "Expect this to be true since the active pack is empty");
    player.openPack();
    ok(!player.activePackEmpty(), "Expect this to be false since we opened a new pack with cards");
});

test("Picking a card", function () {
    'use strict';
    var player = new App.Player({
        packs : new App.Packs([new Test.TestPack()])
    }),
        cid,
        card;

    cid = player.getCurrentPack().listCards().at(0).cid;
    card = player.pickCard(cid);
    equal(player.listPicks().length, 1, "Expect players number of cards to be 1 after initial pick");
    equal(player.listPicks().at(0).cid, cid, "Expect card at first position to have the same ID after the initial pick");
    equal(player.getCurrentPack().listCards().getByCid(cid), null, "Expect no card with the picked ID to be left in the pack");
});

test("Opening a new pack", function () {
    'use strict';
    var pack1 = new Test.TestPack(),
        pack2 = new Test.TestPack(),
        player;

    player = new App.Player({
        packs : new App.Packs([pack1, pack2])
    });

    player.getCurrentPack().listCards().reset(); /* Current pack needs to be empty before opening a new one */
    player.openPack();
    equal(player.getCurrentPack().cid, pack2.cid, "Expect current pack to be the new pack, after opening the second pack");
    equal(player.listUnopenedPacks().length, 0, "Expect no unopened packs to be left");
});

test("Can't open a new pack before the current one is exhausted", function () {
    'use strict';
    var pack1 = new Test.TestPack(),
        pack2 = new Test.TestPack(),
        player;

    player = new App.Player({
        packs : new App.Packs([pack1, pack2])
    });

    player.openPack();
    equal(player.getCurrentPack().cid, pack1.cid, "Expect current pack to be the same after attempting to prematurely open a pack");
    equal(player.listUnopenedPacks().first().cid, pack2.cid, "Expect next pack to be left unopened after attempting to prematurely open a pack");
});

test("Swapping out the current pack", function () {
    'use strict';
    var pack1 = new Test.TestPack(),
        pack2 = new Test.TestPack(),
        player;

    player = new App.Player({
        packs : new App.Packs([pack1])
    });

    equal(player.swapCurrentPack(pack2).cid, pack1.cid, "Expect pack returned from swap to be the former currentPack");
    equal(player.getCurrentPack().cid, pack2.cid, "Expect the new current pack to be the one we passed in");
});