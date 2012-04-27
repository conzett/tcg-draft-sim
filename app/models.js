App.Card = Backbone.Model.extend({
    defaults: {
    }
});

App.Cards = Backbone.Collection.extend({
    model: App.Card
});

App.Pack = Backbone.Model.extend({
    defaults: {
        cards : new App.Cards()
    },
    removeCard: function(cid) {
        var card = this.get('cards').getByCid(cid);
        this.get('cards').remove(card);
        return card;
    }
});

App.Packs = Backbone.Collection.extend({
    model: App.Pack
});

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
    pickCard: function(cid) {
        this.get('cards').push(this.get('currentPack').removeCard(cid));
    },
    openPack: function() {
        var currentpack = this.get('currentPack');
        if(currentpack === null || currentpack.get('cards').length === 0) {
            this.set('currentPack', this.get('packs').shift());
        }        
    },
    swapCurrentPack: function(newPack) {
        var packToReturn = this.get('currentPack');
        this.set('currentPack', newPack);
        return packToReturn;
    }
});

App.Players = Backbone.Collection.extend({
    model: App.Player
});

App.Draft = Backbone.Model.extend({  
    defaults: {
        players : new App.Players()
    },
    passPacks: function() {
        var tempPack;
        this.get('players').each(function(player) {
            tempPack = player.swapCurrentPack(tempPack);
        });
        this.get('players').at(0).set('currentPack', tempPack);
    }
});

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