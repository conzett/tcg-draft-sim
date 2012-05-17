/**
    Creates a new Card.
    @class Represents a card. 
 */
App.Card = Backbone.Model.extend({
    defaults: function () {
        'use strict';
        return {
            pack : new App.Pack()
        };
    },
    /**
     * Pick the card from the pack if it exists
     *
     * @memberOf App.Card
     */
    Pick: function () {
        'use strict';
        this.get('pack').pickCard(this);
    },
});

App.Cards = Backbone.Collection.extend({
    model: App.Card
});

App.Pack = Backbone.Model.extend({
    defaults: function () {
        'use strict';
        return {
            player : new App.Player(),
            cards : new App.Cards()
        };
    },
    initialize : function() {
        'use strict';
        var that = this;
        this.get('cards').map(function(card) {
            return card.set("pack", that);
        });
    },
    pickCard: function (card) {
        'use strict';
        this.get('player').addCardToPicks(card);
        this.get('cards').remove(card);
    },
    GetCards: function () {
        'use strict';
        return this.get('cards');
    }
});

/**
 * Creates a new Player.
 * @class Represents a player.
 * @property {bool} human If the player is human or not.
 * @property {App.Pack} pack The player's open pack.
 * @property {App.Cards} picks The player's picked cards.
 * @property {App.Draft} draft The draft this player is a part of.
 * @property {bool} ready If the player is ready or not.
 */
App.Player = Backbone.Model.extend({
    defaults: function () {
        'use strict';
        return {
            human : false,
            pack : null,
            picks : new App.Cards(),
            draft : null,
            ready : false
        };
    },
    initialize : function() {
        'use strict';
        if (this.get('pack')) {
            this.get('pack').set('player', this);
        }
    },
    addCardToPicks: function (card) {
        'use strict';
        this.get('picks').push(card);
        this.set('ready', true);
    },
    ListPicks : function () {
        'use strict';
        return this.get('picks');
    }
    ,
    GetPack : function () {
        'use strict';
        return this.get('pack');
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
            round : 1
        };
    },
    initialize : function() {
        'use strict';
        var that = this;
        this.get('players').map(function(player) {
            return player.set("draft", that);
        });
    },
    /**
     * Pass all packs between players
     *
     * If players have opened an odd number of packs they will be passed left, and vice versa.
     * If all the current active packs are empty then each player opens their next pack and the
     * round number is incremented.
     *
     * @memberOf App.Draft
     */
    passPacks: function () {
        'use strict';
        var tempPack, i, length;
        if (this.get('round') % 2 === 0) {
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
        if (this.allActivePacksEmpty()) {
            this.get('players').each(function (player) {
                player.openPack();
            });
            this.set('round', this.get('round') + 1);
        }
    }
});