window.Test = {};

Test.MockPackA = App.Pack.extend({});
Test.MockPackB = App.Pack.extend({});
Test.MockPackC = App.Pack.extend({});

module("Standard draft model", {
  setup: function() {
    this.draft = new App.StandardDraft();
  }
});

test("Initialization", function () {
	equal(this.draft.get("players").length, 8, "Expect 8 players in a standard draft");
	equal(this.draft.get("players").where({human: true}).length, 1, "Expect 1 human player");
});

module("Pack model");

test("Initialization", function () {
  var pack = new App.Pack();
	equal(pack.get("cards").length, 15, "Expect 15 cards in a standard pack");
});

test("Removing a card", function () {
  var pack = new App.Pack(), cid, card;
  cid = pack.get("cards").at(0).cid;
  card = pack.removeCard(cid);
  ok(card instanceof App.Card, "removeCard returns a card object");
  equal(pack.get("cards").length, 14, "Expect 14 cards in the pack after one removal");
  equal(card.cid, cid, "Expect the ID of the returned card to match the card is removed");
});

module("Player model");

test("Initialization", function () {
  var player = new App.Player({
      packs : new App.Packs([new Test.MockPackA(), new Test.MockPackB(), new Test.MockPackC()])
  });
	ok(player.get("currentPack") instanceof Test.MockPackA, "Expect currentPack to be the first back in the packs array");
	equal(player.get("packs").length, 2, "Expect 2 non-current packs");
	ok(player.get("packs").at(0) instanceof Test.MockPackB, "Expect first remaining pack to be correct type");
	ok(player.get("packs").at(1) instanceof Test.MockPackC, "Expect second remaining pack to be correct type");
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

test("Opening pack", function () {
  var player = new App.Player({
      packs : new App.Packs([new Test.MockPackA(), new Test.MockPackB()])
  });
  player.openPack();
  ok(player.get("currentPack") instanceof Test.MockPackB, "Expect current pack to be the new type, after opening the second pack");
  equal(player.get('packs').length, 0, "Expect no packs to be left unopened after the player has opned both");
});