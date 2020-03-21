import { Nuxt, Builder } from 'nuxt'
import axios from 'axios'
import { property } from '@dword-design/functions'

export default {
  valid: async () => {
    const nuxt = new Nuxt({
      dev: false,
      modules: [
        [require.resolve('.'), {
          routes: {
            '/foo': (req, res) => res.send({ foo: 'bar' }),
          },
        }],
      ],
    })
    await new Builder(nuxt).build()
    await nuxt.server.listen(3000, 'localhost')
    expect(axios.get('http://localhost:3000/api/foo') |> await |> property('data')).toEqual({ foo: 'bar' })
    nuxt.server.close()
  },
  'top-level option': async () => {
    const nuxt = new Nuxt({
      dev: false,
      modules: [
        require.resolve('.'),
      ],
      expressServer: {
        routes: {
          '/foo': (req, res) => res.send({ foo: 'bar' }),
        },
      },
    })
    await new Builder(nuxt).build()
    await nuxt.server.listen(3000, 'localhost')
    expect(axios.get('http://localhost:3000/api/foo') |> await |> property('data')).toEqual({ foo: 'bar' })
    nuxt.server.close()
  },
  query: async () => {
    const nuxt = new Nuxt({
      dev: false,
      modules: [
        require.resolve('.'),
      ],
      expressServer: {
        routes: {
          '/foo': (req, res) => res.send(req.query.bar),
        },
      },
    })
    await new Builder(nuxt).build()
    await nuxt.server.listen(3000, 'localhost')
    expect(axios.get('http://localhost:3000/api/foo?bar=baz') |> await |> property('data')).toEqual('baz')
    nuxt.server.close()
  },
}