window.Test = {};

Test.TestPack = App.Pack.extend({
    initialize: function() {
        while (this.get('cards').length < 15) {
            this.get('cards').push(new App.Card());
        }
    }
});

module("Draft model");

test("Passing packs", function () {

  var player1 = new App.Player({ packs : new App.Packs([new Test.TestPack()])}),
      player2 = new App.Player({ packs : new App.Packs([new Test.TestPack()])}),
      player3 = new App.Player({ packs : new App.Packs([new Test.TestPack()])}),
      player4 = new App.Player({ packs : new App.Packs([new Test.TestPack()])}),
      draft;

  draft = new App.Draft({
    players : new App.Players([player1, player2, player3, player4])
  });

  draft.passPacks();
  equal(draft.get("players").at(0).get('currentPack').cid,
    player4.get('currentPack').cid, "Expect first player to have player four's pack");

  equal(draft.get("players").at(1).get('currentPack').cid,
    player1.get('currentPack').cid, "Expect second player to have player one's pack");

  equal(draft.get("players").at(2).get('currentPack').cid,
    player2.get('currentPack').cid, "Expect third player to have player twos's pack");

  equal(draft.get("players").at(3).get('currentPack').cid,
    player3.get('currentPack').cid, "Expect fourth player to have player three's pack");
});

module("StandardDraft model", {
  setup: function() {
    this.draft = new App.StandardDraft();
  }
});

test("Initialization", function () {
	equal(this.draft.get("players").length, 8, "Expect 8 players in a standard draft");
	equal(this.draft.get("players").where({human: true}).length, 1, "Expect 1 human player");
});

module("Pack model");

test("Removing a card", function () {
  var pack = new Test.TestPack(), cid, card;
  cid = pack.get("cards").at(0).cid;
  card = pack.removeCard(cid);
  ok(card instanceof App.Card, "removeCard returns a card object");
  equal(pack.get("cards").length, 14, "Expect 14 cards in the test card pack after one removal");
  equal(card.cid, cid, "Expect the ID of the returned card to match the card is removed");
});

module("Player model");

test("Initialization", function () {

  var pack1 = new Test.TestPack(),
      pack2 = new Test.TestPack(),
      pack3 = new Test.TestPack(),
      player;

  player = new App.Player({
      packs : new App.Packs([pack1, pack2, pack3])
  });

	equal(player.get("currentPack").cid, pack1.cid, "Expect currentPack to be the first back in the packs array");
	equal(player.get("packs").length, 2, "Expect 2 non-current packs");
	equal(player.get("packs").at(0).cid, pack2.cid, "Expect first remaining pack to be correct one");
	equal(player.get("packs").at(1).cid, pack3.cid, "Expect second remaining pack to be correct one");
});

test("Picking a card", function () {
  var player = new App.Player({
      packs : new App.Packs([new App.Pack()])
  });
  var cid = player.get('currentPack').get('cards').at(0).cid;
  var card = player.pickCard(cid);
  equal(player.get('cards').length, 1, "Expect players number of cards to be 1 after initial pick");
  equal(player.get('currentPack').get('cards').getByCid(cid), null, "Expect no card with the picked ID to be left in the pack");
});

test("Opening a new pack", function () {

  var pack1 = new Test.TestPack(),
      pack2 = new Test.TestPack(),
      player;

  player = new App.Player({
      packs : new App.Packs([pack1, pack2])
  });

  player.get("currentPack").get('cards').reset(); /* Current pack needs to be empty before opening a new one */
  player.openPack();
  equal(player.get("currentPack").cid, pack2.cid, "Expect current pack to be the new pack, after opening the second pack");
  equal(player.get('packs').length, 0, "Expect no packs to be left unopened after the player has opned both");
});

test("Can't open a new pack before the current one is exhausted", function () {
  var pack1 = new Test.TestPack(),
      pack2 = new Test.TestPack(),
      player;

  player = new App.Player({
      packs : new App.Packs([pack1, pack2])
  });

  player.openPack();
  equal(player.get("currentPack").cid, pack1.cid, "Expect current pack to be the same after attempting to prematurely open a pack");
  equal(player.get('packs').at(0).cid, pack2.cid, "Expect next pack to be left unopened after attempting to prematurely open a pack");
});