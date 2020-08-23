import { mapValues, reduce, values } from '@dword-design/functions'
import express from 'express'

export default function (moduleOptions) {
  const options = { ...this.options.expressServer, ...moduleOptions }
  if (!Array.isArray(options.routes)) {
    options.routes =
      options.routes
      |> mapValues((handler, path) => ({ handler, path }))
      |> values
  }
  this.options.serverMiddleware.push({
    handler:
      options.routes
      |> reduce((api, route) => api.get(route.path, route.handler), express()),
    path: '/api',
  })
}
