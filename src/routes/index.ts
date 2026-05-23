import { createRoute } from '@hono/zod-openapi'
import type { OpenAPIHono, RouteHandler } from '@hono/zod-openapi'
import * as s from '../lib/schemas.js'
import * as authCtrl from '../controllers/auth.js'
import * as itemCtrl from '../controllers/item.js'
import * as userCtrl from '../controllers/user.js'
import * as notifCtrl from '../controllers/notification.js'

export function register(app: OpenAPIHono<any>) {
  // -------------------------------------------------------------------------
  // Auth
  // -------------------------------------------------------------------------
  app.openapi(
    createRoute({
      method: 'post', path: '/auth/register', tags: ['Auth'], summary: 'Register',
      request: { body: { content: { 'application/json': { schema: s.registerBody } } } },
      responses: { '201': { description: 'User registered' }, '400': { description: 'Validation error' }, '409': { description: 'Email already registered' } },
    }),
    authCtrl.register,
  )
  app.openapi(
    createRoute({
      method: 'post', path: '/auth/login', tags: ['Auth'], summary: 'Login',
      request: { body: { content: { 'application/json': { schema: s.loginBody } } } },
      responses: { '200': { description: 'Login successful' }, '400': { description: 'Validation error' }, '401': { description: 'Invalid credentials' } },
    }),
    authCtrl.login,
  )
  app.openapi(
    createRoute({
      method: 'get', path: '/auth/me', tags: ['Auth'], summary: 'Current user',
      security: [{ BearerAuth: [] }],
      responses: { '200': { description: 'Current user' }, '401': { description: 'Unauthorized' } },
    }),
    authCtrl.me,
  )

  // -------------------------------------------------------------------------
  // Items
  // -------------------------------------------------------------------------
  app.openapi(
    createRoute({
      method: 'get', path: '/items', tags: ['Items'], summary: 'List items',
      responses: { '200': { description: 'List' } },
    }),
    itemCtrl.list,
  )
  app.openapi(
    createRoute({
      method: 'get', path: '/items/{id}', tags: ['Items'], summary: 'Get item',
      security: [{ BearerAuth: [] }],
      request: { params: s.itemParams },
      responses: { '200': { description: 'Item' }, '404': { description: 'Not found' } },
    }),
    itemCtrl.show,
  )
  app.openapi(
    createRoute({
      method: 'post', path: '/items', tags: ['Items'], summary: 'Create item',
      security: [{ BearerAuth: [] }],
      request: { body: { content: { 'application/json': { schema: s.createItemBody } } } },
      responses: { '201': { description: 'Created' }, '400': { description: 'Validation error' } },
    }),
    itemCtrl.store,
  )
  app.openapi(
    createRoute({
      method: 'put', path: '/items/{id}', tags: ['Items'], summary: 'Update item',
      security: [{ BearerAuth: [] }],
      request: { params: s.itemParams, body: { content: { 'application/json': { schema: s.updateItemBody } } } },
      responses: { '200': { description: 'Updated' }, '400': { description: 'Validation error' } },
    }),
    itemCtrl.update,
  )
  app.openapi(
    createRoute({
      method: 'delete', path: '/items/{id}', tags: ['Items'], summary: 'Delete item',
      security: [{ BearerAuth: [] }],
      request: { params: s.itemParams },
      responses: { '204': { description: 'Deleted' } },
    }),
    itemCtrl.destroy,
  )

  // -------------------------------------------------------------------------
  // Users
  // -------------------------------------------------------------------------
  app.openapi(
    createRoute({
      method: 'get', path: '/users', tags: ['Users'], summary: 'List users',
      security: [{ BearerAuth: [] }],
      responses: { '200': { description: 'List' } },
    }),
    userCtrl.list,
  )
  app.openapi(
    createRoute({
      method: 'get', path: '/users/{id}', tags: ['Users'], summary: 'Get user',
      security: [{ BearerAuth: [] }],
      request: { params: s.userParams },
      responses: { '200': { description: 'User' }, '404': { description: 'Not found' } },
    }),
    userCtrl.show,
  )
  app.openapi(
    createRoute({
      method: 'post', path: '/users', tags: ['Users'], summary: 'Create user',
      security: [{ BearerAuth: [] }],
      request: { body: { content: { 'application/json': { schema: s.createUserBody } } } },
      responses: { '201': { description: 'Created' }, '400': { description: 'Validation error' } },
    }),
    userCtrl.store,
  )
  app.openapi(
    createRoute({
      method: 'put', path: '/users/{id}', tags: ['Users'], summary: 'Update user',
      security: [{ BearerAuth: [] }],
      request: { params: s.userParams, body: { content: { 'application/json': { schema: s.updateUserBody } } } },
      responses: { '200': { description: 'Updated' }, '400': { description: 'Validation error' } },
    }),
    userCtrl.update,
  )
  app.openapi(
    createRoute({
      method: 'delete', path: '/users/{id}', tags: ['Users'], summary: 'Delete user',
      security: [{ BearerAuth: [] }],
      request: { params: s.userParams },
      responses: { '204': { description: 'Deleted' } },
    }),
    userCtrl.destroy,
  )

  // -------------------------------------------------------------------------
  // Notifications
  // -------------------------------------------------------------------------
  app.openapi(
    createRoute({
      method: 'post', path: '/notifications/send', tags: ['Notifications'], summary: 'Send push',
      security: [{ BearerAuth: [] }],
      request: { body: { content: { 'application/json': { schema: s.notificationBody } } } },
      responses: { '200': { description: 'Sent' }, '400': { description: 'Validation error' }, '502': { description: 'FCM error' } },
    }),
    notifCtrl.send,
  )
  app.openapi(
    createRoute({
      method: 'post', path: '/notifications/test', tags: ['Notifications'], summary: 'Test notification',
      security: [{ BearerAuth: [] }],
      responses: { '200': { description: 'Sent' } },
    }),
    notifCtrl.test,
  )
  app.openapi(
    createRoute({
      method: 'post', path: '/notifications/register-token', tags: ['Notifications'], summary: 'Register token',
      security: [{ BearerAuth: [] }],
      request: { body: { content: { 'application/json': { schema: s.registerTokenBody } } } },
      responses: { '200': { description: 'Registered' }, '400': { description: 'Validation error' } },
    }),
    notifCtrl.registerToken,
  )
}
