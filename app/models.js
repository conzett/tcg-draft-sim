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
    },
    /**
     * List the remaining cards in a pack
     *
     * @memberOf App.Pack
     * @returns {array} of cards in the pack
     */
    listCards: function () {
        'use strict';
        return this.get('cards');
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
            picks : new App.Cards()
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
        this.get('picks').push(this.get('packs').first().removeCard(cid));
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
     * Returns the empty status of the active pack
     *
     * @memberOf App.Player
     * @returns {bool} True if the active pack is empty
     */
    activePackEmpty: function () {
        'use strict';
        return this.get('packs').first().empty();
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
     * List the unopened packs
     *
     * @memberOf App.Player
     * @returns {array} Packs that have not been opened by the player
     */
    listUnopenedPacks: function () {
        'use strict';
        return new App.Packs(this.get('packs').rest());
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
     * List the players picks
     *
     * @memberOf App.Player
     * @returns {array} Cards player has picked
     */
    listPicks: function () {
        'use strict';
        return this.get('picks');
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
            players : new App.Players(),
            packNumber : 1
        };
    },
    /**
     * Pass all packs between players
     *
     * If players have opened an odd number of packs they will be passed left, and vice versa
     *
     * @memberOf App.Draft
     */
    passPacks: function () {
        'use strict';
        var tempPack, i, length;
        if (this.get('packNumber') % 2 === 0) {
            this.get('players').each(function (player) {
                tempPack = player.swapCurrentPack(tempPack);
            });
            this.get('players').at(0).get('packs').unshift(tempPack);
        } else {
            length = this.get('players').length - 1;
            tempPack = this.get('players').first().getCurrentPack();

            for (i = length; i >= 0; i -= 1) {
                tempPack = this.get('players').at(i).swapCurrentPack(tempPack);
            }
        }
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
     * List all the human players in the draft
     *
     * @memberOf App.Draft
     * @returns {array} of human players
     */
    listHumanPlayers: function () {
        'use strict';
        return this.get("players").where({human: true});
    },
    /**
     * List all the bot players in the draft
     *
     * @memberOf App.Draft
     * @returns {array} of bot players
     */
    listBotPlayers: function () {
        'use strict';
        return this.get("players").where({human: false});
    },
    /**
     * Check to see if all the player's active packs are empty
     *
     * @memberOf App.Draft
     * @returns {bool} True if every player's active pack is empty
     */
    allActivePacksEmpty: function () {
        'use strict';
        var empty = true;
        this.get('players').each(function (player) {
            if (!player.activePackEmpty()) {
                empty = false;
                //break;
            }
        });
        return empty;
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