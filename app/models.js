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
    initialize: function() {},
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
    },
    /**
     * Check if the pak is empty
     *
     * @memberOf App.Pack
     * @returns {bool} True if the pack is empty
     */
    empty: function() {
        if( this.get('cards').length > 0 ) {
            return false
        }else{
            return true;
        }
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
        packs : new App.Packs(),
        cards : new App.Cards()
    },
    initialize: function() {

    },
    /**
     * Pick a card from the current pack
     *
     * @memberOf App.Player
     * @param {String} cid CID of the card you want to pick
     * @returns {App.Card} The card specified
     */
    pickCard: function(cid) {
        this.get('cards').push(this.get('packs').first().removeCard(cid));
    },
    /**
     * Open a new pack
     *
     * Shifts a pack from the player's packs to the currentPack property
     *
     * @memberOf App.Player
     */
    openPack: function() {
        if(this.get('packs').first().get('cards').length == 0) {
            this.get('packs').shift(); 
        }             
    },
    /**
     * Return the players current pack
     *
     * @memberOf App.Player
     * @returns {App.Pack} The current open pack
     */
    getCurrentPack: function() {
        return this.get('packs').first();
    },
    /**
     * Swap the players current pack
     *
     * @memberOf App.Player
     * @param {App.Pack} newPack Pack to be swapped with the player
     * @returns {App.Pack} The pack being swapped for
     */
    swapCurrentPack: function(pack) {
        var packToReturn = this.get('packs').shift();
        this.get('packs').unshift(pack);
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
        this.get('players').at(0).get('packs').unshift(tempPack);
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