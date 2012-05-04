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

test("Passing packs left", function () {
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
    equal(draft.getPlayer(0).getCurrentPack().cid, cid2, "Expect first player to have player two's pack");
    equal(draft.getPlayer(1).getCurrentPack().cid, cid3, "Expect second player to have player three's pack");
    equal(draft.getPlayer(2).getCurrentPack().cid, cid4, "Expect third player to have player fours's pack");
    equal(draft.getPlayer(3).getCurrentPack().cid, cid1, "Expect fourth player to have player one's pack");
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