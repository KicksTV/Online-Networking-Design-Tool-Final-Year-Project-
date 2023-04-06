
// initial state
// shape: [{ id, quantity }]
const state = () => ({
  items: [],
  checkoutStatus: null
})

// getters
const getters = {
  cartProducts: (state, getters, rootState) => {
    return state.items.map(({ id, quantity }) => {
      const product = rootState.products.all.find(product => product.id === id)
      return {
        id: product.id,
        title: product.title,
        price: product.price,
        quantity
      }
    })
  },
}

// actions
const actions = {
  async checkout ({ commit, state }, products) {
    const savedCartItems = [...state.items]
    commit('setCheckoutStatus', null)
    // empty cart
    commit('setCartItems', { items: [] })
    try {
      await shop.buyProducts(products)
      commit('setCheckoutStatus', 'successful')
    } catch (e) {
      console.error(e)
      commit('setCheckoutStatus', 'failed')
      // rollback to the cart saved before sending the request
      commit('setCartItems', { items: savedCartItems })
    }
  },
}

// mutations
const mutations = {
  pushProductToCart (state, { id }) {
    state.items.push({
      id,
      quantity: 1
    })
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
  modules: {}
}