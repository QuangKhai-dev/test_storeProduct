import axios from "axios"

export const storeService = {
  getAll: () => {
    return axios({
      method: "GET",
      url: "https://fakestoreapi.com/products"
    })
  }
}