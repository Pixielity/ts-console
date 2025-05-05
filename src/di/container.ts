import { Container } from "inversify"
import "reflect-metadata"

/**
 * The global Inversify container instance
 */
const container = new Container({
  defaultScope: "Singleton",
})

export { container }
