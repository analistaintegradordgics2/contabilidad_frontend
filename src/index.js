import routes from "./routes/contabilidad_routes"

export default {
  install(Vue, { router }) {

    if (!router) {
      console.error("Router no disponible")
      return
    }

    router.addRoutes(routes)

    console.log("Modulo contabilidad cargado")
  }
}