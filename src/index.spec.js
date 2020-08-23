import { property } from '@dword-design/functions'
import axios from 'axios'
import { Builder, Nuxt } from 'nuxt'
import withLocalTmpDir from 'with-local-tmp-dir'

export default {
  query: () =>
    withLocalTmpDir(async () => {
      const nuxt = new Nuxt({
        dev: false,
        expressServer: {
          routes: {
            '/foo': (req, res) => res.send(req.query.bar),
          },
        },
        modules: [require.resolve('.')],
      })
      await new Builder(nuxt).build()
      await nuxt.listen()
      expect(
        axios.get('http://localhost:3000/api/foo?bar=baz')
          |> await
          |> property('data')
      ).toEqual('baz')
      nuxt.close()
    }),
  'top-level option': () =>
    withLocalTmpDir(async () => {
      const nuxt = new Nuxt({
        dev: false,
        expressServer: {
          routes: {
            '/foo': (req, res) => res.send({ foo: 'bar' }),
          },
        },
        modules: [require.resolve('.')],
      })
      await new Builder(nuxt).build()
      await nuxt.listen()
      expect(
        axios.get('http://localhost:3000/api/foo') |> await |> property('data')
      ).toEqual({ foo: 'bar' })
      nuxt.close()
    }),
  valid: () =>
    withLocalTmpDir(async () => {
      const nuxt = new Nuxt({
        dev: false,
        modules: [
          [
            require.resolve('.'),
            {
              routes: {
                '/foo': (req, res) => res.send({ foo: 'bar' }),
              },
            },
          ],
        ],
      })
      await new Builder(nuxt).build()
      await nuxt.listen()
      expect(
        axios.get('http://localhost:3000/api/foo') |> await |> property('data')
      ).toEqual({ foo: 'bar' })
      nuxt.close()
    }),
}
