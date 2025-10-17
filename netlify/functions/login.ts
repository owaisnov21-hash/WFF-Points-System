import { db } from '../../db/client';
import * as schema from '../../db/schema';
import { eq } from 'drizzle-orm';

type Handler = (event: any, context: any) => Promise<{ statusCode: number; body: string; headers?: any }>;

export const handler: Handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { username, password } = JSON.parse(event.body);

    if (!username || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Username and password are required.' }),
      };
    }

    const result = await db
      .select({
          id: schema.users.id,
          username: schema.users.username,
          role: schema.users.role,
          country: schema.users.country,
      })
      .from(schema.users)
      .where(eq(schema.users.username, username) && eq(schema.users.password, password))
      .limit(1);

    const user = result[0];

    if (user) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      };
    } else {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Invalid credentials.' }),
      };
    }
  } catch (error) {
    console.error('Login error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'An internal server error occurred.' }),
    };
  }
};
