/**
    Creates a new Card.
    @class Represents a card. 
 */
App.Card = Backbone.Model.extend({
    defaults: {
    }
});

/**
    Creates a new collection of Cards.
    @class Represents a collection of Cards. 
 */
App.Cards = Backbone.Collection.extend({
    model: App.Card
});

/**
    Creates a new Pack.
    @class Represents a pack. 
 */
App.Pack = Backbone.Model.extend({
    defaults: {
        cards : new App.Cards()
    },
    /**
     * Remove a card from the pack
     *
     * @memberOf App.Pack
     * @param {String} cid CID of the card you want to remove
     * @returns {Card} The card specified
     */
    removeCard: function(cid) {
        var card = this.get('cards').getByCid(cid);
        this.get('cards').remove(card);
        return card;
    }
});

/**
    Creates a new collection of Packs.
    @class Represents a collection of Packs. 
 */
App.Packs = Backbone.Collection.extend({
    model: App.Pack
});

/**
 * Creates a new Player.
 * @class Represents a player.
 * @property {App.Pack} currentPack The player's open pack.
 * @property {App.Packs} packs The player's un-open packs.
 * @property {App.Cards} cards The player's picks.
 */
App.Player = Backbone.Model.extend({
    defaults: {
        human : false,
        currentPack : null,
        packs : new App.Packs(),
        cards : new App.Cards()
    },
    initialize: function() {
        this.openPack();
    },
    /**
     * Pick a card from the current pack
     *
     * @memberOf App.Player
     * @param {String} cid CID of the card you want to pick
     * @returns {App.Card} The card specified
     */
    pickCard: function(cid) {
        this.get('cards').push(this.get('currentPack').removeCard(cid));
    },
    /**
     * Open a new pack
     *
     * Shifts a pack from the player's packs to the currentPack property
     *
     * @memberOf App.Player
     */
    openPack: function() {
        var currentpack = this.get('currentPack');
        if(currentpack === null || currentpack.get('cards').length === 0) {
            this.set('currentPack', this.get('packs').shift());
        }        
    },
    /**
     * Swap the players current pack
     *
     * @memberOf App.Player
     * @param {App.Pack} newPack Pack to be swapped with the player
     * @returns {App.Pack} The pack being swapped for
     */
    swapCurrentPack: function(newPack) {
        var packToReturn = this.get('currentPack');
        this.set('currentPack', newPack);
        return packToReturn;
    }
});

/**
    Creates a new collection of Players.
    @class Represents a collection of Players. 
 */
App.Players = Backbone.Collection.extend({
    model: App.Player
});

/**
    Creates a new Draft.
    @class Represents a draft. 
 */
App.Draft = Backbone.Model.extend({
    defaults: {
        players : new App.Players()
    },
    /**
     * Pass all packs between players
     *
     * @memberOf App.Draft
     */
    passPacks: function() {
        var tempPack;
        this.get('players').each(function(player) {
            tempPack = player.swapCurrentPack(tempPack);
        });
        this.get('players').at(0).set('currentPack', tempPack);
    }
});

/**
    Creates a new StadardDraft.
    @class Represents a standard draft. 
 */
App.StandardDraft = App.Draft.extend({
    initialize: function(){
        this.get('players').push(
            new App.Player({ human : true})
        );

        while (this.get('players').length < 8) {
            this.get('players').push(new App.Player());
        }
    }
});