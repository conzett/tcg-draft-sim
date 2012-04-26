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
    initialize: function() {
        while (this.get('cards').length < 15) {
            this.get('cards').push(new App.Card());
        }
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
        currentPack : new App.Pack(),
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
        this.set('currentPack', this.get('packs').shift());
    }
});

App.Players = Backbone.Collection.extend({
    model: App.Player
});

App.Draft = Backbone.Model.extend({  
    defaults: {
        players : new App.Players()
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