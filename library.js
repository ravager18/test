import pg from 'pg'
const { Client } = pg

export async function query(text, params) {
    const client = new Client({
        user: 'postgres',
        password: 'neparol',
        host: 'localhost',
        port: 5432,
        database: 'test',
    })
    await client.connect()
    const resultQuery = await client.query(text, params)
    await client.end()
    return resultQuery.rows
}