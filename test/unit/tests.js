window.Test = {};

Test.FullPack = App.Pack.extend({
    initialize: function () {
        'use strict';
        while (this.length < 15) {
            this.add(new App.Card({
                pack : this
            }));
        }
    }
});

Test.OneCardPack = App.Pack.extend({
    initialize: function () {
        'use strict';
        while (this.length < 1) {
            this.add(new App.Card({
                pack : this
            }));
        }
    }
});

Test.TestDraft = App.Draft.extend({
    initialize: function () {
        'use strict';
        while (this.get('packs').length < 8) {
            this.get('packs').add(new Test.FullPack({draft : this}));
            this.get('players').add(new App.Player({draft : this}));
        }
    }
});

module("Draft model");

console.log(new Test.OneCardPack());

test("First pack: packs should be passed left", function () {
    'use strict';
});