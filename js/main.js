document.addEventListener("DOMContentLoaded", function(event) { 

    Vue.component('input-address', {
        props: ['minchar', 'maxhelp'],
        data: function () {
            return {
                query: '',
                oldlengthquery: 0,
                tips: [],
                poscursor: 0
            }
        },
        template: '<div class="autoaddress" v-on:keyup="changeCur($event)"> \
                        <input v-on:focus="changeQuery"  class="autoaddress-input" type="text" v-on:keyup="changeQuery" v-model="query" placeholder="Начните вводить адрес..."> \
                        <ul v-if="tips.length > 0" class="autoaddress-list"> \
                            <li class="autoaddress-list-li" v-for="t in tips" v-on:click="selectTip(t)">{{t}}</li> \
                        </ul> \
                    </div>',

        methods: {
            changeCur: function(event) {
                if (event.key === 'ArrowDown') {
                    this.activeTip(this.poscursor + 1);
                }
                if (event.key === 'ArrowUp') {
                    this.activeTip(this.poscursor - 1);
                }
                if (event.key === 'Enter' && this.poscursor > 0) {
                    var value = this.$el.querySelectorAll('.autoaddress-list-li')[this.poscursor - 1].textContent;
                    this.selectTip(value);
                    this.activeTip(0);
                    
                }
            },

            activeTip: function(newpos) {
                if (newpos < 0) {
                    newpos = 0;
                }
                if ( newpos > this.tips.length ) {
                    newpos = this.tips.length;
                }
                if (this.poscursor > 0) {
                    this.$el.querySelectorAll('.autoaddress-list-li')[this.poscursor - 1].classList.remove("active");
                }
                this.poscursor = newpos;
                if (this.poscursor > 0) {
                    this.$el.querySelectorAll('.autoaddress-list-li')[this.poscursor - 1].classList.add("active");
                }
            },
            
            changeQuery: function () {

                if ( this.query !== undefined && this.query.length > this.minchar && this.oldlengthquery != this.query.length) {
                    var _this = this;
                    axios.get('/public/first_group/api.php?query='+this.query+'&maxhelp='+this.maxhelp)
                        .then(function(response) { 
                                if (response.data.length == 1 && response.data[0] == _this.query) {
                                    _this.tips = [];    
                                } else {
                                    _this.tips = response.data;
                                }
                                _this.activeTip(0);
                                
                        });
                    this.oldlengthquery = this.query.length;
                } 
                if (this.query === undefined || this.query.length < this.minchar){
                    this.clearTips();
                }
                
            },
            selectTip: function(value, event) {
                this.query = value; 
                this.changeQuery();
            },

            clearTips: function() {
                this.tips = [];
                this.activeTip(0);
            }

        },
        created: function() {
            var _this = this;
            document.body.addEventListener('click', function(e) {
                if ( e.target.classList.value !== 'autoaddress-list-li' && e.target.classList.value !== 'autoaddress-input') {
                    _this.clearTips();
                }
            }, true);
        }

    });

    new Vue({ el: '#components-input-address' })
});