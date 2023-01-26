<script>
    const _ = require('lodash');
    export default {
        props: {
            searchFields: {
                type: Array,
                default: function () { return [] }
            }
        },
        data() {
            return {
                searchBox: '',
                searchStrings: {},
                sortKeys: [],
                sortWays: []
            }
        },
        methods: {
            filteredList: function(collection, key) {
                var self = this,
                    lowSearch = self.searchBox.toLowerCase(),
                    out;
                
                if (Object.prototype.hasOwnProperty.call(lowSearch, 'trim'))
                    lowSearch = lowSearch.trim();
                if (lowSearch.length > 1) {
                    out = _.filter(collection, function(item) {
                        var match = false
                        for (var field of self.searchFields) {
                            var ss = self.searchStrings[item[key || field]];
                            if (ss && ss.indexOf(lowSearch) > -1 ) // || false
                                match = true
                        }
                        return match
                    })
                    return out
                } else
                    return collection
                
            },
            orderedList: function(collection) {
                var self = this;
                if (self.sortKeys.length)
                    return _.orderBy(collection, self.sortKeys, self.sortWays);
                else
                    return collection
            },
            updateIndex: function (obj, key) {
                var self = this,
                    s = '',
                    l = self.searchFields.length,
                    val = '';
                key = key || 'id';
                for (var j=0; j<l; j++) {
                    // create searchable text index target
                    val = obj[self.searchFields[j]];

                    if (typeof(val) == 'string')
                        s += val.toLowerCase() + ' '
                }
                self.searchStrings[obj[key]] = s;
            },
            indexList: function(collection, initSortKey, indexKey) {
                var self = this;
                // data does not change, all text, let's cache it and lowercase-it
                collection.forEach(function (o) {
                    var key = indexKey || 'id';
                    if (key)
                        self.updateIndex(o, key)
                })
                self.sortKeys = [initSortKey];
                self.sortWays = ['asc'];
            }
        },
        computed: {},
        mounted() {},
    }
</script>
