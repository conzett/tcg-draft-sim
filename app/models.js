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
    defaults: function () {
        'use strict';
        return {
            cards : new App.Cards()
        };
    },
    /**
     * Remove a card from the pack
     *
     * @memberOf App.Pack
     * @param {String} cid CID of the card you want to remove
     * @returns {Card} The card specified
     */
    removeCard: function (cid) {
        'use strict';
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
    empty: function () {
        'use strict';
        if (this.get('cards').length > 0) {
            return false;
        }
        return true;
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
    defaults: function () {
        'use strict';
        return {
            human : false,
            packs : new App.Packs(),
            cards : new App.Cards()
        };
    },
    /**
     * Pick a card from the current pack
     *
     * @memberOf App.Player
     * @param {String} cid CID of the card you want to pick
     * @returns {App.Card} The card specified
     */
    pickCard: function (cid) {
        'use strict';
        this.get('cards').push(this.get('packs').first().removeCard(cid));
    },
    /**
     * Open a new pack
     *
     * Shifts a pack from the player's packs to the currentPack property
     *
     * @memberOf App.Player
     */
    openPack: function () {
        'use strict';
        if (this.get('packs').first().get('cards').length === 0) {
            this.get('packs').shift();
        }
    },
    /**
     * Return the players current pack
     *
     * @memberOf App.Player
     * @returns {App.Pack} The current open pack
     */
    getCurrentPack: function () {
        'use strict';
        return this.get('packs').first();
    },
    /**
     * Get the unopened packs
     *
     * @memberOf App.Player
     * @returns {array} Packs that have not been opened by the player
     */
    getUnopenedPacks: function () {
        'use strict';
        return this.get('packs').rest();
    },
    /**
     * Swap the players current pack
     *
     * @memberOf App.Player
     * @param {App.Pack} newPack Pack to be swapped with the player
     * @returns {App.Pack} The pack being swapped for
     */
    swapCurrentPack: function (pack) {
        'use strict';
        var packToReturn = this.get('packs').shift();
        this.get('packs').unshift(pack);
        return packToReturn;
    },
    /**
     * Get the players picks
     *
     * @memberOf App.Player
     * @returns {array} Cards player has picked
     */
    getPicks: function () {
        'use strict';
        return this.get('cards');
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
    defaults: function () {
        'use strict';
        return {
            players : new App.Players()
        };
    },
    /**
     * Pass all packs between players
     *
     * @memberOf App.Draft
     */
    passPacks: function () {
        'use strict';
        var tempPack;
        this.get('players').each(function (player) {
            tempPack = player.swapCurrentPack(tempPack);
        });
        this.get('players').at(0).get('packs').unshift(tempPack);
    },
    /**
     * Shorcut method to get a player based on their position
     *
     * @memberOf App.Draft
     * @param {int} position 0 index position of a player
     * @returns {App.Player} The player at that position
     */
    getPlayer: function (position) {
        'use strict';
        return this.get("players").at(position);
    },
    /**
     * Get all the human players in the draft
     *
     * @memberOf App.Draft
     * @returns {array} of human players
     */
    getHumanPlayers: function () {
        'use strict';
        return this.get("players").where({human: true});
    },
    /**
     * Get all the bot players in the draft
     *
     * @memberOf App.Draft
     * @returns {array} of bot players
     */
    getBotPlayers: function () {
        'use strict';
        return this.get("players").where({human: false});
    }
});

/**
    Creates a new StadardDraft.
    @class Represents a standard draft. 
 */
App.StandardDraft = App.Draft.extend({
    initialize: function () {
        'use strict';
        this.get('players').push(
            new App.Player({ human : true})
        );

        while (this.get('players').length < 8) {
            this.get('players').push(new App.Player());
        }
    }
});